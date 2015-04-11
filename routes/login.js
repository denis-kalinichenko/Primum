/**
 * Created by Denis on 2015-04-07.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var md5 = require('MD5');
var conf = require('conf');
var randomstring = require("randomstring");


var User = require('models/user.js');


router.get('/', function(req, res, next) {
    res.render('login', { conf: conf, title: 'Login' });
}).post('/', function(req, res, next) {
    var login = req.body.login;
    var password = req.body.password;

    User.findOne({username: login}, function (err, user) {
        if (user) {
            if(user.password === md5(password)) {
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
    });


});

module.exports = router;
