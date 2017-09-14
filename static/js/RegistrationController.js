// This is an Immediately Invoked Function Expression to avoid global variable usage.
(function() {
  // Below block expression created a module and a controller attached to it.
  var app = angular.module("emailProvider");

  function RegistrationController($http,$scope, $location) {
	$scope.password="";
	$scope.username="";
	$scope.name="";
	$scope.surname="";
	$scope.email="";
	$scope.errorInfo = null;

	$scope.signup = function() {
		var genRandomString = function(length){
		    return CryptoJS.lib.WordArray.random(16);   
		};
		var sha3 = function(){
			var salt = genRandomString(16); /** Gives us salt of length 16 */
	    		var hash = CryptoJS.SHA256(salt + $scope.password); /** Hashing algorithm sha3 */
	    		return {
				salt:salt,
				passwordHash:hash
	    		};
		};
		var encrypted_data = sha3()
		console.log("hash: " + encrypted_data.passwordHash.toString(CryptoJS.Base64))
		console.log("salt: " + encrypted_data.salt.toString())
		var data = {
		            hash: encrypted_data.passwordHash.toString(CryptoJS.Base64),
			    salt: encrypted_data.salt.toString(),
			    email: $scope.email,
			    username: $scope.username,
			    name: $scope.name,
			    surname: $scope.surname
		};
		var config = {
		    headers : {
		        "Content-Type": "application/json; charset = utf-8;"
		    }
		};

		if(angular.isUndefined($scope.email)){
			$scope.errorInfo="*Email is not valid!";
			return;
		}
		
		$http.post("/signUp", JSON.stringify(data), config)
		   .then(function (data) {
		      if(data.data.status==="ERROR"){
		      		$scope.errorInfo="*E-mail or username is already signed up!";
		      }
		      else{
	      		        $location.path("/"+$scope.username);
		      }
		   }, function (data) {
		      console.log("error :" + data);
		   });
	}
       
  }
  
  app.controller("RegistrationController", RegistrationController);
  
})();

/* ----------------- */
