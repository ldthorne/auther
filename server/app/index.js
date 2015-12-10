'use strict'; 

var app = require('express')();
var path = require('path');
var chalk = require('chalk');
var session = require('express-session');
var passport = require('passport');

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