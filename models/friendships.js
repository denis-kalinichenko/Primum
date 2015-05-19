var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('libs/mongoose');
var db = mongoose.connection;
autoIncrement.initialize(db);
var util = require("util");
var async = require("async");
var config = require('config');

var friendshipSchema = new mongoose.Schema({
    users: {
        1: {
            type: Number,
            required: true
        },
        2: {
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
            type: Data
        }
    }
});

friendshipSchema.plugin(autoIncrement.plugin, { model: 'Friendship', field: 'id', startAt: 1 });

friendshipSchema.statics.send = function(from, to, callback) {
    var Friendship = this;

    async.waterfall([
        function(callback) {
            Friendship.findOne({ "users.1": from, "users.2": to }, callback);
        },
        function(friendship, callback) {
            if (friendship) {
                callback(new AuthError("They are friends"));
            } else {

                var friendship = new Friendship({
                    username: post.username //TODO done it
                });
                user.save(function(err, new_user) {
                    if (err) return callback(err);
                    callback(null, new_user);
                });
            }
        }
    ], callback);
};