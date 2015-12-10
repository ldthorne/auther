'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('logout', {
    url: '/logout',
    templateUrl: '/browser/app/home/home.html',
    controller: "LogoutController"
  });
});