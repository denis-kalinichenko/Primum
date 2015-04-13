/*var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
autoIncrement.initialize(db);*/

var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('libs/mongoose');
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
        required: true
    },
    name: {
        first: String,
        last: String
    },
    email: {
        main: {
            type: String,
            unique: true,
            required: true
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

userSchema.statics.authorize = function (username, password, callback) {
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
                callback(new AuthError("User exists."));
            }
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
                callback(new AuthError("username must be uniq"));
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
    var confirm_url = config.get("protocol") + "://"+ config.get("domain") +"/register/activate?id=" + user.user_id + "&key=" + user.email.valid_key;
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

exports.User = mongoose.model('User', userSchema);


function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}
util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;