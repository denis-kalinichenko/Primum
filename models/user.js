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
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_id', startAt: 1 });

userSchema.methods.encryptPassword = function (password, salt) {
    salt = (salt) ? salt : randomstring.generate();
    return md5(salt + sha1(password) + sha1(this.username));
};

userSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password, this.salt) === this.password;
};

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

exports.User = mongoose.model('User', userSchema);


function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;