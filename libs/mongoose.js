/**
 * Created by Denis on 2015-04-11.
 */
var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.get("mongoose:uri"), config.get("mongoose:options"), function(err) {
    if(err) {
        console.log('connection error', err);
    }
});

module.exports = mongoose;