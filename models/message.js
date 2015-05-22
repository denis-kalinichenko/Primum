var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('libs/mongoose');
var db = mongoose.connection;
autoIncrement.initialize(db);
var util = require("util");
var async = require("async");
var config = require('config');


var messageSchema = new mongoose.Schema({
    friendship_id: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    sent: {
        type: Date,
        default: Date.now
    }
});

messageSchema.plugin(autoIncrement.plugin, { model: 'Message', field: 'id', startAt: 1 });

if (!messageSchema.options.toObject) messageSchema.options.toObject = {};
messageSchema.options.toObject.transform = function (doc, ret, options) {
    delete ret._id;
};


messageSchema.statics.saveToDB = function (msg, callback) {
    var Message = this;

    async.waterfall([
        function(callback) {
            var message = new Message(msg);
            message.save(function(err, new_message) {
                if (err) return callback(err);
                callback(null, new_message);
            });
        }
    ], callback);
};


exports.Message = mongoose.model('Message', messageSchema);


function MsgError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, MsgError);
    this.message = message;
}
util.inherits(MsgError, Error);

MsgError.prototype.name = 'MsgError';

exports.MsgError = MsgError;