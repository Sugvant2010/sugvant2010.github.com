var User = require('../models/users.js');
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = {
  one: function(req, res, next) {
    User.findById(req.user._id, 'username email', function (err, user) {
      if (err) { return next(err); }
      res.json({result: true, user : user});
    });
  },
  login: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        return res.json({result : false, error : info});
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json({result : true, id : user._id});
      });
    })(req, res, next);
  },
  logout: function(req, res) {
    req.logout();
    res.json({result: true, note: "logout"});
  },
  signUp: function(req, res, next) {
    var user = new User({
      username : req.body.username,
      email : req.body.email,
      password : req.body.password
    });
    user.save(function (err, user) {
      if (err && (11000 === err.code || 11001 === err.code)) {
        res.json({result : false, error : err, note: "Ошибка ввода данных"});
      }else{
        if (err) { return next(err); }

        passport.authenticate('local')(req, res, function () {
          res.json({result : true , id : user._id });
        });
      }
    });
  },
  update: function(req, res, next) {
    User.findOne(req.user._id, function(err, user){
      console.log(err);
      if (err) { return next(err); }
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.password = req.body.password ? req.body.password : user.password;

      user.save(function(err, user) {
        console.log(err);
        console.log(user);
        if (err && (11000 === err.code || 11001 === err.code)) {
          res.json({result : false, error : err, note: "Ошибка ввода данных"});
        }else{
          if (err) { return next(err); }

          res.json({result : true, user : user, note: "Данные успешно обновлены"});
        }
      });
    });
  },
  forgot: function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            return res.json({ result: false , note : 'Неудалось найти пользователя с таким email\'ом '});
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var letter = {
          to: user.email,
          from: 'passwordreset@shortink.com',
          subject: 'Смена пароля',
          text: '' +'Ссылка для смены пароля.\n'+
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'Если вы не запрашивали смену пароля, пожалуйста, игнорируйте это сообщение, и ваш пароль будет оставаться неизменным.\n'
        };

        var options = {
          auth: {
            api_key: "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"
          }
        };
        var mailer = nodemailer.createTransport(sgTransport(options));
        mailer.sendMail(letter, function(err) {
          if (err) { return next(err); }
          done(err,'done');
        });

      }
    ], function(err) {
      if (err) { return next(err); }
      res.json({ result: true, note: 'На указанный email отправлено письмо с инструкциями по смене пароля'});
    });
  },
  reset: function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            return res.json({result : false, error : "no user"});
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err, user, next) {
            if (err) { return next(err); }
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {

        var letter = {
          to: user.email,
          from: 'passwordreset@shortink.com',
          subject: 'Смена пароля',
          text: 'Ваш пароль для аккаунта' + user.username + ' был изменен.\n'
        };
        var options = {
          auth: {
            api_key: "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"
          }
        };
        var mailer = nodemailer.createTransport(sgTransport(options));
        mailer.sendMail(letter, function(err, res, next) {
          if (err) { return next(err); }
          done(err,'done');
        });

      }
    ], function(err,next) {
      if (err) { return next(err); }
      res.json({result : true , note : 'Пароль был изменен'});
    });
  },
  checkSession: function(req,res){
    if (req.user){
      res.json({result : true, id: req.user._id});
    }else{
      res.json({result : false, note: "Неавторизованная сессия"});
    }
  }
};
