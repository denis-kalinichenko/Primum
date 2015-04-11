exports.connect = function () {
    var mongoose = require('mongoose');
    var autoIncrement = require('mongoose-auto-increment');
    mongoose.connect('mongodb://localhost/primum', function(err) {
        if(err) {
            console.log('connection error', err);
        } else {
            var db = mongoose.connection;
            autoIncrement.initialize(db);
        }
    });
};