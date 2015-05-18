var express = require('express');
var router = express.Router();
var config = require('config');

var User = require('models/user').User;
var AuthError = require('models/user').AuthError;

router.get('/', function(req, res, next) {
    sess=req.session;
    if(sess.username) {
        res.render('chat', { title: 'Primum', logged: true, session: sess });
    } else {
        res.redirect("/login");
    }
}).get('/search', function(req, res, next) {
    sess=req.session;
    if(sess.username) {
        if(req.query.username == sess.username) {
            var result = {
              "error": 1,
               "error_msg": "Its your username"
            };
            return res.send(JSON.stringify(result));
        }
        User.searchByUsername(req.query.username, "user_id name username -_id ", function(err, user) {
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
    } else {
        res.redirect("/login");
    }
}).post('/add', function(req, res, next) {
    sess=req.session;

    if(sess.username) {
        res.send(req.body.id);
    } else {
        res.redirect("/login");
    }

});

module.exports = router;