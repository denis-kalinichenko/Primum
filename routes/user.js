var express = require('express');
var router = express.Router();
var config = require('config');


var User = require('models/user').User;
var AuthError = require('models/user').AuthError;

var Friendship = require('models/friendship').Friendship;
var FriendError = require('models/friendship').FriendError;

var checkAuth = require('middleware/checkAuth');



router.get('/', checkAuth, function(req, res, next) {
    res.send("user module");
}).post('/add', checkAuth, function(req, res, next) {
    Friendship.sendRequest(req.user.user_id, req.body.id, function(err, friendship) {
        if(err) {
            if (err instanceof FriendError) {
                return res.send(err.message);
            } else {
                next(err);
            }
        }
        res.send("request sent");
    });
}).get('/id/:id', checkAuth, function(req, res, next) {
    var id = req.params.id;
    User.findById(id, "user_id name username -_id", function(err, user) {
        if(err) {
            next(err);
        }
        if(user != null) {
            var result = {
                user_id: user.user_id,
                username: user.username,
                name: user.name
            };
        } else {
            var result = {
                "error": 1,
                "error_msg": "Cannot find user"
            };
        }
        return res.send(JSON.stringify(result));
    });
});

module.exports = router;