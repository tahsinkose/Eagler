// This is an Immediately Invoked Function Expression to avoid global variable usage.
(function() {
  // Below block expression created a module and a controller attached to it.
  var app = angular.module("emailProvider");
    function UserController($http,$scope,$routeParams,$location) {
	$scope.to=null;
	$scope.subject=null;
	$scope.mail=null;
	//Check for valid logon.
	
	//This would automatically fetch the inbox mails.
	$scope.inbox_emails = null;
	$scope.outbox_emails = null;
	
	var outboxFetched = false;
	
	$scope.viewEmail = null;
	var fetch_outbox = function(){
		var data = {
			    user: $routeParams.username,
		};
		var config = {
			    headers : {
				"Content-Type": "application/json; charset = utf-8;"
			    }
		}
		$http.post("/fetch_outbox",JSON.stringify(data), config)
			.then(function(data) {
				$scope.outbox_emails = [];
				for(var key in data.data.Outbox){
					//console.log(data.data.Outbox[key]);
					$scope.outbox_emails.push(data.data.Outbox[key])
				}
				var length = $scope.outbox_emails.length;
				for(i=length-1;i>=0;i--){
					$scope.outbox_emails[i].pad_date = (i*20) - 2;
				}
			}, function(data){
				console.log("error :" + data);
			});		

	};
	var selection = "iconImg msCheckAll msCheck";

	
	var whichView = null;

	$scope.logout = function(){
		$location.path("/");
	};
	
	$scope.setView = function(view){
		whichView = view;
	};	

	$scope.getView = function(){
		if(whichView === "newMail"){
			outboxFetched = false;
			return "static/partials/mail.html";
		}
		else if(whichView === "inbox"){
			return "static/partials/inbox.html";
		}
		else if(whichView === "outbox"){
			if(outboxFetched === false){
				fetch_outbox();
				outboxFetched = true;
			}
			return "static/partials/outbox.html";
		}	
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
	$scope.changeSelection = function(){
		if(selection === "iconImg msCheckAll msCheck"){
			selection = "iconImg msCheckAll msCheckOn";
		}
		else{
			selection = "iconImg msCheckAll msCheck";
		}
	}
	$scope.applySelection = function(){
		return selection;
		
	};

	$scope.showMail = function(email){
		$scope.viewEmail = email.mail;
	};
	
  }
  
  app.controller("UserController", UserController);
})();

/* ----------------- */
