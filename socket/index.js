var log = require('libs/log')(module);
var config = require('config');
var async = require('async');
var cookieParser = require('cookie-parser');
var HttpError = require('error').HttpError;

var sessionStore = require('libs/sessionStore');
var session = require('express-session');

var User = require('models/user').User;
var Friendship = require('models/friendship').Friendship;
var Message = require('models/message').Message;
var MsgError = require('models/message').MsgError;

module.exports = function(server, sessionMiddleware) {
    var io = require('socket.io').listen(server);

    io.use(function(socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.sockets.on('connection', function(socket) {

        Friendship.getFriends(socket.request.session.user_id, function(err, friends) {
            if(friends) {
                friends.forEach(function(friend) {
                    socket.join(friend.friendship_id);
                });
            }
        });

        socket.on('chat message', function(data){
            // socket.request.session

            Message.saveToDB({ friendship_id: data.friendship_id, from: socket.request.session.user_id, text: data.text}, function (err, message) {
                if(err) {
                    if (err instanceof MsgError) {
                        //return res.render('register', { title: 'Register', reg_error: err.message });
                    }
                }
                socket.to(data.friendship_id).emit('chat message', {
                    friendship_id: data.friendship_id,
                    from: {
                        username: socket.request.session.username,
                        user_id: socket.request.session.user_id,
                        name: socket.request.session.name
                    },
                    text: data.text
                });
            });

        });

        socket.on('disconnect', function() {
            console.log("socket disconnect");
        });

    });

    return io;
};