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
          .when('/:username',{
            templateUrl:'../static/partials/user.html',
            controller: "UserController"
          })
          .otherwise({redirectTo:"/"});
    
  });
  
  
}());
