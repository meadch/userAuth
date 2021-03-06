import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import logger from 'morgan';
// Initializes mongo connection
import './config/db';

// Pulls in routers
import {
  mainRouter,
  usersRouter
} from './routes'

const app = express(),
      PORT = 8000;

var routes = require('./routes');

// View engine setup
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.static(path.join(__dirname, '../bower_components')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Validation setup
require('./util/validator')(app);

app.use(cookieParser());

// Express messages
app.use(require('connect-flash')());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use('/users', usersRouter);
app.use('/', mainRouter);

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

app.listen(PORT, ()=>{
  console.log(`Running on ${PORT}`);
})
