// This is an Immediately Invoked Function Expression to avoid global variable usage.
(function() {
  // Below block expression created a module and a controller attached to it.
  var app = angular.module("emailProvider");

  function MainController($http,$scope, $location) {

	$scope.errorInfo = null;
	$scope.email="";
    	$scope.password="";

    $scope.signup = function() {
	$location.path("/registration");
    };
  
    $scope.whenTyping = function(){ 
    	if($scope.errorInfo){
		$scope.errorInfo=null
	}
    };
    $scope.login = function(email){
	var data = {
			    email: email,
			    password: $scope.password	
	};
	var config = {
		    headers : {
		        "Content-Type": "application/json; charset = utf-8;"
		    }
	};	
	$http.post("/login", JSON.stringify(data), config)
		   .then(function (data) {
		      if(data.data.status==="NOT_EXISTS"){
		      		$scope.errorInfo="*E-mail is not registered!";
		      }
		      else if(data.data.status==="WRONG"){
				$scope.errorInfo="*Password is incorrect.";
		      }
		      else{
	      		        $location.path("/"+data.data.message);
		      }
		   }, function (data) {
		      console.log("error :" + data);
		   });



    }

    
       
  }
  
  app.controller("MainController", MainController);
  
})();

/* ----------------- */
