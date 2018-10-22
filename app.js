var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('./config/config');

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var post = require('./routes/post');
var search = require('./routes/search');
var oauth = require('./routes/oauth');
var fbAuth = require('./routes/fb-auth');
var googleAuth = require('./routes/google-auth');
var config = require('./config/config');

var app = express();

mongoose.connect(config.mongoUrlProd, { useMongoClient: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOptions));

// Handle Express Session
app.use(session({
    secret: config.secret,
    saveUninitialized: true,
    resave: true
}));

// Passport Session
app.use(passport.initialize());
require('./config/passport')(passport);
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/api/v1', post);
app.use('/fb-auth', fbAuth);
app.use('/google-auth', googleAuth);
app.use('/oauth', oauth);
app.use('/search', search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
