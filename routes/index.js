var express = require('express');
var router = express.Router();
var conf = require('../conf');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: conf.APP_NAME });
});

module.exports = router;
