var express = require('express');
var router = express.Router();
var config = require('config');


/* GET home page. */

router.get('/', function(req, res, next) {
  sess=req.session;
  if(sess.username)
  {
    /*
     * This line check Session existence.
     * If it existed will do some action.
     */
    res.redirect('/chat');
  } else{
    res.render('index', { title: config.get("name") });
  }

}).get('/logout', function (req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
