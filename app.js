var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let flash = require('connect-flash')
require('./passport_setup')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view options', { pretty: true });
app.locals.pretty = true;

app.use(flash())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var env  = process.env.NODE_ENV || 'development';
var configs = {
  development, production
} = require('./config/cloud.js');
var config = configs[env];
var redis_config = config.redis;

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('redis');
var client = redis.createClient(redis_config.port, redis_config.host);

// These 3 has to be declared in this order or
// your sessions will fail and you won't know why! :)
// FIXME: Genereate proper session secret.
app.use(session({
    store: new RedisStore({
      host: redis_config.host,
      port: redis_config.port,
      client: client,
      logErrors: true,
    }),
    secret: '1234-Uxf;\'aap2E``45',
    maxAge: Date.now() + (15 * 86400 * 1000),
    saveUninitialized: false,
    resave: false,
    secure: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// middleware for currentUser to use in pug files
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
