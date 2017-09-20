// This is an Immediately Invoked Function Expression to avoid global variable usage.
(function() {
  // Below block expression created a module and a controller attached to it.
  var config = {
    headers: {
      "Content-Type": "application/json; charset = utf-8;"
    }
  };
  var app = angular.module("emailProvider");

  function UserController($http, $scope, $routeParams, $location, $parse) {

    //IIFE to check whether user exists. It is devised to prevent malicious attacks.
    (function() {
      var data = {
        user: $routeParams.username,
      };
      $http.post("/doesExist", JSON.stringify(data), config)
        .then(function(data) {
          if (data.data.status === '404') {
            $location.path('/404');
          } else {
            //IIFE to check whether user did login legally.
            (function() {
              var data = {
                user: $routeParams.username,
              };
              $http.post("/validLogin", JSON.stringify(data), config)
                .then(function(data) {
                  if (data.data.status === '405') {
                    $location.path('/405');
                  }
                }, function(data) {

                });

            })();
          }
        }, function(data) {

        });

    })();



    $scope.to = null;
    $scope.subject = null;
    $scope.mail = null;

    $scope.inbox_emails = null;
    $scope.outbox_emails = null;
    
    $scope.viewEmail = null;

    var outboxFetched = false;
    var inboxFetched = false;
    var draftFetched = false;
    
    var emailCount = 0;
    var emailClassNames = [];


    var selectionAll = "iconImg msCheckAll msCheck";	
    var suffix = "selectClass_";	
    var whichView = null;
    
    /*----------------------------------------------HELPER FUNCTIONS---------------------------*/
    var clean = function(arg) {
      emailCount = 0;
      emailClassNames = [];
      if (arg === 0) { //This means clean all.
        outboxFetched = false;
        inboxFetched = false;
        draftFetched = false;
      } else if (arg === 1) { //Clean all but the first one -> "outboxFetched"
        inboxFetched = false;
        draftFetched = false;
      } else if (arg === 2) { //Clean all but the second one -> "inboxFetched"
        outboxFetched = false;
        draftFetched = false;
      } else if (arg === 3) { //Clean all but the third one -> "draftFetched"
        inboxFetched = false;
        outboxFetched = false;
      }
    };
    var starterParser = function(index) {
	
	var className = suffix + index;
	if(emailClassNames.indexOf(className) === -1){	
		emailClassNames.push(className);
	}
	
	var classVar = $parse(className);
	return classVar;

    };

    var updateMailCount = function() {

	emailCount = emailClassNames.length;
    };

    var parser = function(index) {
	var className = suffix + index;
	var classVar = $parse(className);
	return classVar;

    };
    $scope.showMail = function(email) {
      $scope.viewEmail = email.mail;
    }; 
    $scope.anyCheckedMail = function(){
	if(selectionAll === "iconImg msCheckAll msCheckOn"){
		return true;
	}
	for(var i=0;i<emailCount;i++){
		var classVar = parser(i);
		if($scope.$eval(classVar) === "iconImg msCheckOn"){
			return true;
		}
	}
	return false;
		
    };
    /*-------------------------------------------------------------------------*/
    /*-----------------------------FOLDER FETCHERS ----------------------------*/
    var fetch_outbox = function() {
      var data = {
        user: $routeParams.username,
      };
      $http.post("/fetch_outbox", JSON.stringify(data), config)
        .then(function(data) {
          $scope.outbox_emails = [];
          for (var key in data.data.Outbox) {
            //console.log(data.data.Outbox[key]);
            $scope.outbox_emails.push(data.data.Outbox[key])
          }
          var length = $scope.outbox_emails.length;
          for (i = length - 1; i >= 0; i--) {
            $scope.outbox_emails[i].pad_date = (i * 20) - 2;
          }
        }, function(data) {
          console.log("error :" + data);
        });

    };


    var fetch_inbox = function() {
      var data = {
        user: $routeParams.username,
      };

      $http.post("/fetch_inbox", JSON.stringify(data), config)
        .then(function(data) {
          $scope.inbox_emails = [];
          for (var key in data.data.Inbox) {
            $scope.inbox_emails.push(data.data.Inbox[key])
          }
          var length = $scope.inbox_emails.length;
          for (i = length - 1; i >= 0; i--) {
            $scope.inbox_emails[i].pad_date = (i * 20) - 2;
          }
        }, function(data) {
          console.log("error :" + data);
        });

    };

    var fetch_draft = function() {
      var data = {
        user: $routeParams.username,
      };

      $http.post("/fetch_draft", JSON.stringify(data), config)
        .then(function(data) {
          $scope.draft_emails = [];
          for (var key in data.data.Drafts) {
            $scope.draft_emails.push(data.data.Drafts[key])
          }
          var length = $scope.draft_emails.length;
          for (i = length - 1; i >= 0; i--) {
            $scope.draft_emails[i].pad_date = (i * 20) - 2;
          }
        }, function(data) {
          console.log("error :" + data);
        });

    };
    /*-------------------------------------------------------------------------*/
    /*--------------------------------------VIEW OPERATIONS--------------------*/
    $scope.setView = function(view) {
      whichView = view;
    };

    $scope.getView = function() {
      if (whichView === "newMail") {
        /*---Since the view has changed, we should assign them as false ---*/
        clean(0);
        /*---So that, the execution can further check the boxes whether there is new data in it or not---*/
        /*---This method designated to prevent infinite looping when fetching boxes take roll during the view update.---*/
        return "static/partials/mail.html";
      } else if (whichView === "inbox") {
        if (inboxFetched === false) {
          fetch_inbox();
          inboxFetched = true;
          clean(2);
          $scope.viewEmail = null;
        }
        return "static/partials/inbox.html";
      } else if (whichView === "outbox") {
        if (outboxFetched === false) {
          fetch_outbox();
          outboxFetched = true;
          clean(1);
          $scope.viewEmail = null;
        }
        return "static/partials/outbox.html";
      } else if (whichView === "draft") {
        if (draftFetched === false) {
          fetch_draft();
          draftFetched = true;
          clean(3);
          $scope.viewEmail = null;
        }
        return "static/partials/draft.html";
      }

    };
    /*--------------------------------------------------------------------------*/
    /*-------------------------------------LOGOUT-------------------------------*/
    $scope.logout = function() {
      var data = {
        user: $routeParams.username,
      };
      $http.post("/logout", JSON.stringify(data), config)
        .then(function(data) {}, function(data) {});
      $location.path("/");
    };
    /*--------------------------------------------------------------------------*/
    /*---------------------------------LOGISTIC OPS---------------------------*/
    $scope.sendMail = function(to, subject, mail) {
      var data = {
        from: $routeParams.username,
        to: to,
        subject: subject,
        mail: mail
      };
      $http.post("/send_mail", JSON.stringify(data), config)
        .then(function(data) {
		if(data.data.status==="NOT_EXISTS"){
			alert("Receiver does not exist in the database..");
		}
        }, function(data) {
          console.log("error :" + data);
        });
    };

    $scope.saveToDraft = function(to, subject, mail) {
      var data = {
        from: $routeParams.username,
        to: to,
        subject: subject,
        mail: mail
      };
      $http.post("/save_draft", JSON.stringify(data), config)
        .then(function(data) {
          console.log(data.data.status);
        }, function(data) {
          console.log("error :" + data);
        });
    };

    $scope.delete = function() {
	//Need to check which mails are "checked On".
	var reduceBy = 0;
	for(var i=0;i<emailCount;i++){
		var classVar = parser(i);
		if($scope.$eval(classVar) === "iconImg msCheckOn"){
			var data = {
				from: $routeParams.username,
				index: i - reduceBy,
				folder: whichView
			};
			reduceBy += 1;
			$http.post("/delete",JSON.stringify(data),config)
			   .then(function(data) {
				if(whichView === "inbox"){
					inboxFetched = false;
				}
				else if(whichView === "outbox"){
					outboxFetched = false;
				}
				else if(whichView === "draft"){
					draftFetched = false;
				}
			   }, function(data) {
				console.log("error :" + data);
			   });
		}
	}

    };
    /*--------------------------------------------------------------------------*/


    /*------------------------------DYNAMIC CLASS MANIPULATERS------------------*/
    // Used to manipulate checkboxes next to the mails properly.
    $scope.changeSelectionAll = function() {
      if (selectionAll === "iconImg msCheckAll msCheck") {
        selectionAll = "iconImg msCheckAll msCheckOn";
	for(var i=0;i<emailCount;i+=1){
		var classVar = parser(i);
		classVar.assign($scope,"iconImg msCheckOn");
	}
      } else {
        selectionAll = "iconImg msCheckAll msCheck";
	for(var i=0;i<emailCount;i+=1){
		var classVar = parser(i);
		classVar.assign($scope,"iconImg msCheck");
	}
      }

	
    }
    $scope.changeSelection = function(index) {
	var classVar = parser(index);
	if($scope.$eval(classVar) === "iconImg msCheck"){
		classVar.assign($scope,"iconImg msCheckOn");
	}
	else {
		classVar.assign($scope,"iconImg msCheck");
	}

    };

	
    $scope.applySelectiontoAll = function() {
	
        return selectionAll;
    };

	
    $scope.applySelection = function() {
	return selection;
    };

    

    $scope.startClass = function(index) {
   	var classVar = starterParser(index);
	classVar.assign($scope,"iconImg msCheck");
    };


    $scope.showClass = function(index){
	var classVar = parser(index);
	updateMailCount();
	return $scope.$eval(classVar);
    };
    /*--------------------------------------------------------------------------*/

  }

  app.controller("UserController", UserController);
})();

/* ----------------- */ // Code goes here
