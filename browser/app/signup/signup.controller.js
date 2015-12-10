app.controller("SignUpController", function($scope, AuthFactory){
	$scope.signUp = function(){
		AuthFactory.signUp($scope.signupForm.email, $scope.signupForm.password);
	}
});