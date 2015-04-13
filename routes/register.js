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
                return res.send(err.message);
            } else {
                next(err);
            }
        }

        res.send("reg complete! email sent!");
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
