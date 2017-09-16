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
	var inboxFetched = false;
	
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


	var fetch_inbox = function(){
		var data = {
			    user: $routeParams.username,
		};
		var config = {
			    headers : {
				"Content-Type": "application/json; charset = utf-8;"
			    }
		}
		$http.post("/fetch_inbox",JSON.stringify(data), config)
			.then(function(data) {
				$scope.inbox_emails = [];
				for(var key in data.data.Inbox){
					$scope.inbox_emails.push(data.data.Inbox[key])
				}
				var length = $scope.inbox_emails.length;
				for(i=length-1;i>=0;i--){
					$scope.inbox_emails[i].pad_date = (i*20) - 2;
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
			/*---Since the view has changed, we should assign them as false ---*/
			outboxFetched = false;
			inboxFetched = false;
			/*---So that, the execution can further check the boxes whether there is new data in it or not---*/
			/*---This method designated to prevent infinite looping when fetching boxes take roll during the view update.---*/
			return "static/partials/mail.html";
		}
		else if(whichView === "inbox"){
			if(inboxFetched === false){
				fetch_inbox();
				inboxFetched = true;
				outboxFetched = false;
				$scope.viewEmail = null;
			}
			return "static/partials/inbox.html";
		}
		else if(whichView === "outbox"){
			if(outboxFetched === false){
				fetch_outbox();
				outboxFetched = true;
				inboxFetched = false;
				$scope.viewEmail = null;
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
