/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Justin Cook   Student ID: 118404169   Date: 2017-02-25
*
* Online (Heroku) Link: https://vast-stream-84912.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var service = require("./data-service.js");  
var querystring = require("querystring");
app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
  res.sendFile(path.join(__dirname + "/views/home.html"));
});

//another route for finding home with /home
app.get("/home", function(req,res){
  res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
  res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get("/employees*/", function(req,res){
  var result = querystring.parse(req.originalUrl, "?", "=");
  if(result.department){
    service.getEmployeesByDepartment(result.department).then((data) =>{
      res.json(data);
    }).catch((err) => {
      res.json({message: err});
    })
  }
  else if(result.status){
    service.getEmployeesByStatus(result.status).then(function(data){
      res.json(data);
    })
  }
  else if(result.manager){
    service.getEmployeesByManager(result.manager).then(function(data){
      res.json(data);
    })
  }
  else{
    res.send(result);
  }

});
app.get("/employee/[0-9]*", function(req,res){
  //Had to use a regular substring because the url wasn't in JSON and I couldn't figure out another way
  var result = req.originalUrl.substring(req.originalUrl.lastIndexOf('/')+1);
  service.getEmployeeByNum(result).then(function(data){
      res.json(data);
    })
});
app.get("/managers", function(req,res){
  service.getManagers().then(function(data){
      res.json(data);
    })
});
app.get("/departments", function(req,res){
  service.getDepartments().then(function(data){
      res.json(data);
    })
});

// setup http server to listen on HTTP_PORT
service.initialize().then(()=>{
  app.listen(HTTP_PORT, onHttpStart);
}).catch( ()=>{
  console.log("Error initializing.");
})