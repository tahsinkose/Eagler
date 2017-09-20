This project is implemented with **AngularJS**, **Flask** and **MongoDB**. It is a simple email service provider that has basic features.
To replicate the execution, one need to setup Mongo database, collection and indexes. Open your mongo database server and execute below commands: To replicate the website execution, one need to setup Mongo database, collection and indexes. Following is the step by step guide:
 * `use angular_flask_db`		
 * `use userData`		
 ```		
 db.runCommand(		
 {		
   createIndexes: "userData",		
      indexes: [		
      {		
           key: {		
             name: 1		
           },		
           name: "name",		
           unique: false		
      },		
      {		
      key: {		
            surname: 1		
          },		
          name: "surname",		
          unique: false		
      },		
      {		
          key: {		
            username: 1		
          },		
          name: "username",		
          unique: true		
      },		
      {		
         key: {		
           email: 1		
         },		
         name: "email",		
         unique: true		
       },		
       {		
         key: {		
           hash: 1		
         },		
          name: "hash",		
         unique: false		
     },		
      {		
          key: {		
             salt: 1		
           },		
           name: "salt",		
           unique: false		
       },		
       {		
           key: {		
             from: 1,		
             subject: 1,		
             mail: 1		
           },		
           name: "Inbox",		
           unique: false		
       },		
       {		
           key: {		
             to: 1,		
             subject: 1,		
             mail: 1		
           },		
           name: "Outbox",		
           unique: false		
       },
       {		
           key: {		
             to: 1,		
             subject: 1,		
             mail: 1		
           },		
           name: "Drafts",		
           unique: false		
       },
       {
           key: {
             currentIP: 1,
           },
           name: "currentIP",
           unique: false
       }
    ]		
 })		
 ```		
 After database environment is ready, navigate to the folder where `web_app.py` is located and execute `python web_app.py`.		
 		
 *The website is still under construction. It is more like a forum now, since only insite users can send and receive mails.*
