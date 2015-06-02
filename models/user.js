var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('libs/mongoose');
require('mongoose-strip-html-tags')(mongoose);
var db = mongoose.connection;
autoIncrement.initialize(db);
var randomstring = require("randomstring");
var util = require("util");
var async = require("async");
var md5 = require('MD5');
var sha1 = require('sha1');
var config = require('config');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(config.get("nodemailer"));



var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        stripHtmlTags: true
    },
    name: {
        first: {
            type: String,
            trim: true,
            stripHtmlTags: true
        },
        last: {
            type: String,
            trim: true,
            stripHtmlTags: true
        }
    },
    email: {
        main: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            stripHtmlTags: true
        },
        valid: {type: Boolean, default: false},
        valid_key: String
    },
    userpic: { //TODO npm mongoose-file
        small: String,
        medium: String,
        origin: String
    },
    activity: {
        last: {
          seen: Date,
            ip: String
        },
        reg: {
            type: Date,
            default: Date.now
        },
        deleted: Boolean
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id', startAt: 1 });

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
    delete ret._id;
    if(options.module == "friends") {
        delete ret.activity.reg;
        delete ret.activity.last.ip;
        delete ret.email.valid_key;
        delete ret.email.valid;
    }
};

userSchema.methods.encryptPassword = function (password) {
    return md5(sha1(this.salt) + sha1(password));
};

userSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

userSchema.virtual('password').set(function(password) {
        this._plainPassword = password;
        this.salt = randomstring.generate();
        this.hashedPassword = this.encryptPassword(password);
    }).get(function() { return this._plainPassword; });

userSchema.statics.authorize = function (username, password, ip, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if(user) {
                if(user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new AuthError("Password incorrect."));
                }
            } else {
                callback(new AuthError("User does not exist"));
            }
        },
        function(user, callback) {
            user.activity.last.seen = Date.now();
            user.activity.last.ip = ip;

            user.save(function(err) {
                if(!err) {
                    callback(null, user);
                } else {
                    //callback(null, user);
                    callback(new AuthError(err)); //TODO fix ValidationError: Path `email.main` is required. for user_id 1
                }
            });
        }
    ], callback);
};

userSchema.statics.register = function(post, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: post.username}, callback);
        },
        function(user, callback) {
            if (user) {
                callback(new AuthError("User with same username already exists"));
            } else {

                var email_key = randomstring.generate();

                var user = new User({
                    username: post.username,
                    password: post.password,
                    name: {
                        first: post.first_name,
                        last: post.last_name
                    },
                    email: {
                        main: post.email,
                        valid_key: email_key
                    }
                });
                user.save(function(err, new_user) {
                    if (err) return callback(err);
                    new_user.sendConfirmMail(new_user);
                    callback(null, new_user);
                });
            }
        }
    ], callback);
};

userSchema.methods.sendConfirmMail = function(user) {
    var port = (config.get("port") == 80) ? '' : ':' + config.get("port");
    var confirm_url = config.get("protocol") + "://"+ config.get("domain") + port + "/register/activate?id=" + user.user_id + "&key=" + user.email.valid_key;
    var mailOptions = {
        from: config.get("name") + '<'+config.get("mail:user")+'>',
        to: user.email.main,
        subject: 'Registration', //TODO global dictionary
        html: '<b>Hello, '+ user.name.first +'</b> <br/>please, verify your e-mail address ' + user.email.main +'<br/>' +
        'Click the link: <a href="'+confirm_url+'">'+confirm_url+'</a>' //TODO e-mail templates
    };
    transporter.sendMail(mailOptions, function(error, info){
        error_m = error;
        info_m = info;
        if(error){
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
};

userSchema.statics.confirmMail = function(post, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            var query = { 'user_id': post.id, 'email.valid_key': post.key };
            User.findOneAndUpdate(query, {  email: { valid: true, valid_key: undefined } }, {new: true}, function(err, user) {
                if (err) return callback(err);
                callback(null, user);
            });
        }
    ], callback);
};

userSchema.statics.findByUsername = function(username, select, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            var query = { 'username': username };
            User.findOne(query, function(err, user) {
                if (err) return callback(err);
                callback(null, user);
            }).select(select);
        }
    ], callback);
};

userSchema.statics.findById = function(id, select, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            var query = { 'user_id': id };
            User.findOne(query, function(err, user) {
                if (err) return callback(err);
                callback(null, user);
            }).select(select);
        }
    ], callback);
};

exports.User = mongoose.model('User', userSchema);


function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}
util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;