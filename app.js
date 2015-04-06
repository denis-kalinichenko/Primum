var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('validator');

var conf = require('./conf');
console.log(conf.APP_NAME);

var mongodb = require('mongodb');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
mongoose.connect('mongodb://localhost/primum');
var db = mongoose.connection;
autoIncrement.initialize(db);
var models = require('./models')(mongoose, autoIncrement);

var new_user = new models.Users({
    'username': 'kalinichenk0',
    name: {
        first: "Denis",
        last: "Kalinichenko"
    },
    birthday: new Date('06.02.1996').toISOString(),
    email: {
        main: "kalini4enk0@ya.ru",
        valid: false
    },
    sex: 1,
    reg: new Date()
});

new_user.save(function(err, new_user) {
    if (err) return console.error(err);
});


var routes = require('./routes/index');
var register = require('./routes/register');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/register', register);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
http.listen(80, function(){
    console.log('listening on *:80');
});

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
