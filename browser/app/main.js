'use strict';

var app = angular.module('auther', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');

  // This is here because we don't want to go to
  // '/auth/provider' as a front-end state, we want
  // to go to the server-side route. 
  $urlRouterProvider.when('/auth/:provider', function () {
      window.location.reload();
  });
});