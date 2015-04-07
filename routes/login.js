/**
 * Created by Denis on 2015-04-07.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var md5 = require('MD5');
var conf = require('../conf');
var randomstring = require("randomstring");

var User = require('../models/user.js');


router.get('/', function(req, res, next) {
    res.render('login', { conf: conf, title: 'Login' });
}).post('/', function(req, res, next) {
    var post = req.body;
    if (post.login === 'denis' && post.password === '123') {
        req.session.user_id = 1;
        res.redirect('/my_secret_page');
    } else {
        res.send('Bad user/pass');
    }
});

module.exports = router;
