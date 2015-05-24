var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({mongoose_connection: mongoose.connection});

module.exports = sessionStore;