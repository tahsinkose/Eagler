// This is an Immediately Invoked Function Expression to avoid global variable usage.
(function() {
  // Below block expression created a module and a controller attached to it.
  var app = angular.module("emailProvider");

  function Cntrl405($scope, $location,$interval) {
	var decrementCountdown = function() {

      		$scope.countdown -= 1;
      		if ($scope.countdown < 1) {
        		$location.path("/");
      		}
    };
	$scope.countdown = 10;
	$interval(decrementCountdown, 1000, 10);
	
    

    
       
  }
  
  app.controller("405Controller", Cntrl405);
  
})();

/* ----------------- */
