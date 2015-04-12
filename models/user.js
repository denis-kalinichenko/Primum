/*var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
autoIncrement.initialize(db);*/

var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('libs/mongoose');
var db = mongoose.connection;
autoIncrement.initialize(db);

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
module.exports = mongoose.model('User', userSchema);
