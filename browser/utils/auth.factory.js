app.factory("AuthFactory", function($http, $state){
	var currentUser;
	$http.post("/api/auth/me")
		.then(function(user){
			console.log(user)
			currentUser = user.data;
		})
		.catch(function(err){
			console.error(err);
		})
	return {
		signUp: function(email, password){
			console.log("we're getting to the factory!")
			return $http.post("/api/users/signup", {
				email:email,
				password:password
			}).then(function(user){
				console.log(user);
				return user.data;
			}).then(function(data){
				currentUser = data;

				$state.go("home");
			})
			.catch(function(error){
				console.error("This account cannot be added", error);
			});
		},
		login: function(email, password){
			return $http.post("/api/users/login", {
				email:email,
				password:password
			}).then(function(user){
				// console.log("signed in", user);
				return user.data;
			}).then(function(data){
				currentUser = data;
				console.log(data);
				$state.go("home");
			}).catch(function(error){
				console.error("This account does not exist in our database",error);
			});
		}, 
		logout: function() {
			return $http.get("/api/users/logout")
				.then(function(){
					currentUser = null;
					$state.go("home");
				}).catch(function(error){
					console.error("Couldn't log out", error);
				});
		},
		getCurrentUser: function(){
			return currentUser
		}

	}
})