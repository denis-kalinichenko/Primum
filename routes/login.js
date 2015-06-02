/**
 * Created by Denis on 2015-04-07.
 */
var express = require('express');
var router = express.Router();

var User = require('models/user').User;
var AuthError = require('models/user').AuthError;


router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
}).post('/', function(req, res, next) {
    var username = req.body.login;
    var password = req.body.password;
    var ip = req.connection.remoteAddress;

    User.authorize(username, password, ip, function (err, user) {
        if(err) {
            if (err instanceof AuthError) {
                //return res.send(err.message);
                return res.render('login', { title: 'Login', login_error: err.message });
            } else {
                next(err);
            }
        }

        req.session.username = user.username;
        req.session.user_id = user.user_id;
        res.redirect("/");
    });
});

module.exports = router;
