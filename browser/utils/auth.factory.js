app.factory("AuthFactory", function($http, $state){
	
	return {
		signUp: function(email, password){
			console.log("we're getting to the factory!")
			return $http.post("/api/users/signup", {
				email:email,
				password:password
			}).then(function(user){
				console.log(user);
				return user.data;
			}).then(function(){
				$state.go("home")
			})
			.catch(function(error){
				console.error(error).bind(console)
			});
		},
		login: function(email, password){
			return $http.post("/api/users/login", {
				email:email,
				password:password
			}).then(function(user){
				console.log("signed in",user);
				return user.data;
			}).then(function(data){
				console.log(data)
				$state.go("home")

			}).catch(function(error){
				console.error("This account does not exist in our database",error);
			});
		}

	}
})