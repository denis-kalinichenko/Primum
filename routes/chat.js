var express = require('express');
var router = express.Router();
var config = require('config');

router.get('/', function(req, res, next) {
    sess=req.session;
    if(sess.username) {
        res.render('chat', { title: 'Primum', logged: true, session: sess });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;