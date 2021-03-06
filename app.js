var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'),
    MongoStore = require('connect-mongo')(session);
var mongoose = require('libs/mongoose');



var config = require('config');
var log = require("libs/log")(module);


var routes = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var chat = require('./routes/chat');
var user = require('./routes/user');


var app = express();

var http = require('http').Server(app);
//var io = require('socket.io')(http);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var sessionStore = require('libs/sessionStore');
var sessionMiddleware = session({
    secret: config.get("session:secret"),
    key: config.get("session:key"),
    cookie: config.get("session:cookie"),
    resave: true,
    saveUninitialized: true,
    store: sessionStore
});

app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('middleware/loadUser'));

app.use('/', routes);
app.use('/register', register);
app.use('/login', login);
app.use('/chat', chat);
app.use('/user', user);


http.listen(config.get('port'), function(){
    log.info('listening on *:'+config.get('port'));
});

var io = require('socket')(http, sessionMiddleware);
app.set('io', io);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.locals.pretty = true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
