(function() {

  var github = function($http) {

    var getUser = function(username) {
      return $http.get("https://api.github.com/users/" + username)
        .then(function(response) {
          return response.data;
        });
    };

    var getRepos = function(user) {
      return $http.get(user.repos_url)
        .then(function(response) {
          return response.data;
        });
    };

    var getRepoInfo = function(username,reponame){
      var repo;
      var repoUrl = "https://api.github.com/repos/" + username +"/" + reponame;
      
      return $http.get(repoUrl)
        .then(function(response) {
          repo = response.data;
          return $http.get(repoUrl + "/contributors");
        })
        .then(function(response) {
          repo.contributors = response.data;
          return repo;
        });
    };
    

    return {
      getUser: getUser,
      getRepos: getRepos,
      getRepoInfo: getRepoInfo,
    };
    
  };

  var module = angular.module("emailProvider");
  module.factory("github",github);
  
}());
