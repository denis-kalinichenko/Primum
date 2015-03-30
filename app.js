var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('validator');


var mongodb = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

    var movieSchema = new mongoose.Schema({
        title: { type: String },
        rating: String,
        releaseYear: Number,
        hasCreditCookie: Boolean
    });

    var Movie = mongoose.model('Movie', movieSchema);

    var thor = new Movie({
        title: 'Thor',
        rating: 'PG-13',
        releaseYear: '2011',  // Notice the use of a String rather than a Number - Mongoose will automatically convert this for us.
        hasCreditCookie: true
    });

    thor.save(function(err, thor) {
        if (err) return console.error(err);
    });

    // Find a single movie by name.
    Movie.findOne({ title: 'Thor' }, function(err, thor) {
        if (err) return console.error(err);
        console.dir(thor);
    });

    // Find all movies.
    Movie.find(function(err, movies) {
        if (err) return console.error(err);
        console.dir(movies);
    });

    // Find all movies that have a credit cookie.
    Movie.find({ hasCreditCookie: true }, function(err, movies) {
        if (err) return console.error(err);
        console.dir(movies);
    });


});


var routes = require('./routes/index');
var users = require('./routes/users');

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
app.use('/users', users);

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
