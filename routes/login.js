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
    sess=req.session;
    //In this we are assigning email to sess.email variable.
    //email comes from HTML page.
    sess.username=req.body.login;
    res.end('done');
});

module.exports = router;
