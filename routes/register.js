var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var md5 = require('MD5');
var conf = require('../conf');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');

var User = require('../models/user.js');


var transporter = nodemailer.createTransport({
  service: conf.MAIL.service,
  auth: {
    user: conf.MAIL.user,
    pass: conf.MAIL.pass
  }
});

router.get('/', function(req, res, next) {
  res.render('register', { conf: conf, title: 'Register' });
}).post('/', function(req, res, next) {

    // all data ok!
    var email_key = randomstring.generate();
    var new_user = new User ({
    'username': req.body.login,
    name: {
      first: req.body.first_name,
      last: req.body.last_name
    },
    email: {
        main: req.body.email,
        valid: false,
        valid_key: email_key
    },
    activity: {
        reg: new Date()
    },
    password: md5(req.body.password)
    });

  new_user.save(function(err, new_user) {
    if (err) return console.error(err);

      var valid_url = conf.APP_PROTOCOL + "://"+conf.APP_DOMAIN+"/register/activate?id=" + new_user.user_id + "&key=" + new_user.email.valid_key;

      var mailOptions = {
        from: conf.APP_NAME + '<'+conf.MAIL.user+'>',
        to: req.body.email,
        subject: 'Registration', //TODO global dictionary
        html: '<b>Hello, '+new_user.name.first+'</b> <br/>please, verify your e-mail address ' + req.body.email +'<br/>' +
        'Click the link: <a href="'+valid_url+'">'+valid_url+'</a>' //TODO e-mail templates
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
      });


    res.send("data sent");
  });


}).get("/activate", function(req, res, next) {

    if(req.query.id && req.query.key) {
        var query = { 'user_id': req.query.id, 'email.valid_key': req.query.key };
        User.findOneAndUpdate(query, {  email: { valid: true, valid_key: undefined } }, {new: true}, function(err, user) {
            res.redirect("/login");
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router;
