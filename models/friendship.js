var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('libs/mongoose');
var db = mongoose.connection;
autoIncrement.initialize(db);
var util = require("util");
var async = require("async");
var config = require('config');

var User = require('models/user').User;
var AuthError = require('models/user').AuthError;


var friendshipSchema = new mongoose.Schema({
    users: {
        from: {
            type: Number,
            required: true
        },
        to: {
            type: Number,
            required: true
        }
    },
    confirmed: {
        type: Boolean,
        default: false,
        required: true
    },
    date: {
        sent: {
            type: Date,
            default: Date.now,
            required: true
        },
        confirmed: {
            type: Date
        }
    }
});

friendshipSchema.plugin(autoIncrement.plugin, { model: 'Friendship', field: 'id', startAt: 1 });

friendshipSchema.statics.sendRequest = function(from, to, callback) {
    var Friendship = this;

    async.waterfall([
        function(callback) {
            Friendship.findOne({ $or: [{"users.to": from, "users.from": to} , {"users.from": from, "users.to": to}] }).exec(callback);
        },
        function(friendship, callback) {
            if (friendship) {
                callback(new FriendError("It is your friend or request not confirmed yet."));
            } else {
                console.log("4");
                var friendship = new Friendship({
                    users: {
                        from: from,
                        to: to
                    }
                 });
                friendship.save(function(err, new_friendship) {
                     if (err) return callback(err);
                     callback(null, new_friendship);
                 });
            }
        }
    ], callback);
};

friendshipSchema.statics.getFriendsRequests = function(id, callback) {
    var Friendship = this;

    async.waterfall([
        function(callback) {
            Friendship.find({ "users.to": id, confirmed: false }, callback);
        },
        function(friendships, callback) {
            callback(null, friendships);
        }
    ], callback);
};


exports.Friendship = mongoose.model('Friendship', friendshipSchema);


function FriendError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, FriendError);

    this.message = message;
}
util.inherits(FriendError, Error);

FriendError.prototype.name = 'FriendError';

exports.FriendError = FriendError;