// This is an Immediately Invoked Function Expression to avoid global variable usage.
(function() {
  // Below block expression created a module and a controller attached to it.
  var app = angular.module("emailProvider");
    function UserController($http,$scope,$routeParams,$location) {
	$scope.to=null;
	$scope.subject=null;
	$scope.mail=null;
	//Check for valid logon.
	$scope.openNewmail = null;
	$scope.logout = function(){
		$location.path("/");
	};
	$scope.newmail = function(){
		$scope.openNewmail = true;
	};

	$scope.sendMail = function(to,subject,mail){
		var data = {
			    from: $routeParams.username,
			    to: to,
			    subject: subject,
			    mail: mail	
		};
		var config = {
			    headers : {
				"Content-Type": "application/json; charset = utf-8;"
			    }
		}
		$http.post("/send_mail",JSON.stringify(data), config)
			.then(function(data) {
				console.log(data.data.status);
			}, function(data){
				console.log("error :" + data);
			});		
	};
	
  }
  
  app.controller("UserController", UserController);
})();

/* ----------------- */
