var log = require('libs/log')(module);
var config = require('config');
var async = require('async');
var cookieParser = require('cookie-parser');
var HttpError = require('error').HttpError;
var User = require('models/user').User;
var sessionStore = require('libs/sessionStore');
var session = require('express-session');

module.exports = function(server, sessionMiddleware) {
    var io = require('socket.io').listen(server);

    io.use(function(socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.sockets.on('connection', function(socket) {

        socket.on('chat message', function(data){
            console.log(socket.request.session);
            console.log('message: ' + data.text);
            console.log('fid: ' + data.friendship_id);
        });

        socket.on('disconnect', function() {
            console.log("socket disconnect");
        });

    });

    return io;
};