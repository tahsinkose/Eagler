(function(){
  
  var app = angular.module("emailProvider",["ngAnimate","ngRoute"]);
  
  app.config(function($routeProvider){
      $routeProvider
          .when('/',{
            templateUrl: '../static/partials/main.html',
            controller: "MainController"
          })
          .when('/registration',{
            templateUrl:'../static/partials/registration.html',
            controller: "RegistrationController"
          })
	  .when('/404',{
	    templateUrl:'../static/partials/404.html'
	  })
	  .when('/405',{
	    templateUrl:'../static/partials/405.html',
	    controller: "405Controller"
	  })
          .when('/:username',{
            templateUrl:'../static/partials/user.html',
            controller: "UserController"
          })
          .otherwise({redirectTo:"/"});
    
  });
  
  
}());
