var express = require('express');
var router = express.Router();
var config = require('config');

var User = require('models/user').User;
var AuthError = require('models/user').AuthError;

var Friendship = require('models/friendship').Friendship;

var Message = require('models/message').Message;
var MsgError = require('models/message').MsgError;

var checkAuth = require('middleware/checkAuth');

router.get('/', checkAuth, function(req, res, next) {
    var friends = false;
    Friendship.getFriends(req.user.user_id, function(err, friends) {
        res.render('chat', { title: 'Primum', logged: true, user: req.user, friendsRequests: req.friendsRequests, friends: friends });
    });
}).get('/search', checkAuth, function(req, res, next) {
    if(req.query.username == req.session.username) {
        var result = {
          "error": 1,
           "error_msg": "Its your username"
        };
        return res.send(JSON.stringify(result));
    }
    User.findByUsername(req.query.username, "user_id name username -_id ", function(err, user) {
        if(err) {
            if (err instanceof AuthError) {
                return res.send(err.message);
            } else {
                next(err);
            }
        }
        if(user != null) {
            var result = {
                user_id: user.user_id,
                username: user.username,
                name: user.name
            };
            res.send(JSON.stringify(result));
        } else {
            var result = {
                "error": 1,
                "error_msg": "Cannot find user"
            };
            return res.send(JSON.stringify(result));
        }
    });
});

module.exports = router;