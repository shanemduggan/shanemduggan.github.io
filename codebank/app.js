var express = require("express");
var app = express();
var path = require("path");
var fs = require('fs');

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'../index.html'));
});

app.listen(3000);
console.log("Running at Port 3000");


var obj = JSON.parse(fs.readFileSync('../data/timeout.txt', 'utf8'));
console.log(obj);
