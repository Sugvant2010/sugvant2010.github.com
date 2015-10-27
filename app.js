var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var conf = require('./config.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users.js');
var mongoose = require('mongoose');

mongoose.connect( conf.dbConnect , function(err) {
  if(err){
    console.log('connection error', err);
  }else{
    console.log('connection successful');
  }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret:  conf.secret,
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { username : { message: 'Пользователь с таким логином не найден.' } }); }
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { password : { message: 'Неправильный пароль.' } });
      }
    });
  });
}));


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    if(err){
      done(err);
    }else{
      done(null, user);
    }
  });
});


app.use('/api/', require('./routes'));
app.use('/partials', express.static(__dirname + 'public/partials'));

app.get('/:shortLink', require('./routes/links').shortLink);


app.use('/*', function(req,res){
  res.render('index');
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


//if (app.get('env') === 'development') {

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.json({
    result: false,
    error: err
  });
});


module.exports = app;
