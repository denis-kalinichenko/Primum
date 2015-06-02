var express = require('express');
var router = express.Router();

var User = require('models/user').User;
var AuthError = require('models/user').AuthError;


router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
}).post('/', function(req, res, next) {

    // all data ok!
    User.register(req.body, function (err, user) {
        if(err) {
            if (err instanceof AuthError) {
                return res.render('register', { title: 'Register', reg_error: err.message });
            } else {
                next(err);
            }
        }
        User.authorize(req.body.username, req.body.password, req.connection.remoteAddress, function (err, user) {
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
            req.session.name = user.name;
            res.redirect("/");
        });
    });


}).get("/activate", function(req, res, next) {

    if(req.query.id && req.query.key) {
        User.confirmMail(req.query, function(err, user) {
            if(err) {
                if (err instanceof AuthError) {
                    return res.send(err.message);
                } else {
                    next(err);
                }
            }

            res.send("email confirmed");
        });
    } else {

        res.send("/");
    }
});

module.exports = router;
