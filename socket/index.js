var log = require('libs/log')(module);
var config = require('config');
var async = require('async');
var cookieParser = require('cookie-parser');
var HttpError = require('error').HttpError;
var User = require('models/user').User;
var sessionStore = require('libs/sessionStore');

module.exports = function(server) {
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function(socket) {


        socket.on('chat message', function(data){
            console.log('message: ' + data.text);
            console.log('fid: ' + data.friendship_id);
        });

        socket.on('disconnect', function() {
            console.log("socket disconnect");
        });

    });

    return io;
};