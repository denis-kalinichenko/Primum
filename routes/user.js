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
    //res.send("addded"+req.body.id);
    Friendship.sendRequest(req.user.user_id, req.body.id, function(err, friendship) {
        if(err) {
            if (err instanceof FriendError) {
                return res.send(err.message);
            } else {
                next(err);
            }
        }

        console.dir(friendship);
    });
});

module.exports = router;