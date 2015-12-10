app.controller('LogoutController', function($scope, AuthFactory){
  $scope.logout = AuthFactory.logout();
});