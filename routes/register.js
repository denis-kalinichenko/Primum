var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
mongoose.connect('mongodb://localhost/primum');
var db = mongoose.connection;
autoIncrement.initialize(db);
var models = require('../models')(mongoose, autoIncrement);
var conf = require('../conf');

var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
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

  var new_user = new models.Users({
    'username': req.body.login,
    name: {
      first: req.body.first_name,
      last: req.body.last_name
    },
    birthday: new Date(req.body.birthday).toISOString(),
    email: {
      main: req.body.email,
      valid: false
    },
    sex: req.body.sex,
    reg: new Date(),
    password: req.body.password
  });

  new_user.save(function(err, new_user) {
    if (err) return console.error(err);

    var email_key = randomstring.generate();
    var valid_url = conf.APP_PROTOCOL + "://"+conf.APP_DOMAIN+"/activate?id=" + new_user.user_id + "&key=" + email_key;

    var new_valid = new models.Valids({ //TODO denormalize it !!!
      user_id: new_user.user_id,
      email: req.body.email,
      key: email_key
    });

    new_valid.save(function(err, new_valid) {
      if (err) return console.error(err);

      var mailOptions = {
        from: conf.APP_NAME + '<'+conf.MAIL.user+'>',
        to: req.body.email,
        subject: 'Registration', //TODO global dictionary
        html: '<b>Hello,</b> <br/>please, verify your e-mail address ' + req.body.email +'<br/>' +
        'Click the link: <a href="'+valid_url+'">'+valid_url+'</a>' //TODO e-mail templates
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        }else{
          console.log('Message sent: ' + info.response);
        }
      });
    });

    res.send("data sent");
  });


});

module.exports = router;
