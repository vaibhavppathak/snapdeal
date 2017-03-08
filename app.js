var express = require('express'); //require express module
var app = express(); //creatig insatnce of express function
var mongoose = require('mongoose'); //require moongose module
var db = require('./mongodb/db.js'); // create route for database
var routes = require('./routes/index.js'); //create route for index


app.use(db());
app.use('/', routes);

// Listen to this Port
app.listen(3015, function() {
    console.log("Server started at port number: 3015");
});
