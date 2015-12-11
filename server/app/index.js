'use strict'; 

var app = require('express')();
var path = require('path');
var chalk = require('chalk');
var session = require('express-session');
var passport = require('passport');
var passportGoogleOauth = require('passport-google-oauth');

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

app.use(session({
  secret: 'humanbeingsshouldbefree'
}));

app.use(function (req, res, next) {
  console.log(chalk.red("req session", req.session.userId));
  next();
});

app.use(passport.initialize());
app.use(passport.session());

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
    new GoogleStrategy({
        clientID: '1058055038244-l220mdesg2adkgepq2q31c8j7bav60v5.apps.googleusercontent.com',
        clientSecret: 'u-dFo_A1UlT3QkyKMRzYf5xv',
        callbackURL: '/'
    },
    // google will send back the token and profile
    function (token, refreshToken, profile, done) {
        // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
        console.log(chalk.blue('---', 'in verification callback', profile, '---'));
        done();
    })
);

app.get('/api/auth/google', passport.authenticate('google', { scope : 'email' }));

app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/home',
    failureRedirect : '/'
  }));

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;