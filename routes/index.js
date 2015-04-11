var express = require('express');
var router = express.Router();
var conf = require('conf');


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
    res.render('index', { title: conf.APP_NAME });
  }

}).get('/chat', function (req, res, next) {
  sess=req.session;
  if(sess.username)
  {
    res.write('<h1>Hello '+sess.username+'</h1> ');
    res.end('<a href="/logout">Logout</a>');
  }
  else
  {
    res.write(' <h1>Please login first.</h1> ');
    res.end('<a href="/login">Login</a>');
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
