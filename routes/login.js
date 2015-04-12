/**
 * Created by Denis on 2015-04-07.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var config = require('config');

var User = require('models/user').User;
var AuthError = require('models/user').AuthError;


router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
}).post('/', function(req, res, next) {
    var username = req.body.login;
    var password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if(err) {
            if (err instanceof AuthError) {
                return res.send(err.message);
            } else {
                next(err);
            }
        }

        req.session.username = user.username;
        res.redirect("/");
    });

/*    User.findOne({username: login}, function (err, user) {
        if (user) {
            if(user.password === md5(user.salt + sha1(password) + sha1(login))) {
                sess=req.session;
                //In this we are assigning email to sess.email variable.
                //email comes from HTML page.
                sess.username=req.body.login;
                res.redirect("/");
            } else {
                res.send("uncorrect pass!");
            }
        } else {
            res.send("user not exists");
        }
    });*/


});

module.exports = router;
