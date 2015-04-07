var express = require('express');
var router = express.Router();
var conf = require('../conf');

//var func = require('../func/auth.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: conf.APP_NAME });
}).get('/chat', function (req, res, next) {
  res.send('if you are viewing this page it means you are logged in');
});

module.exports = router;
