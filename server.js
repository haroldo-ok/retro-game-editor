'use strict';

var express = require('express');
var logger = require('morgan');
var app = express();

// log requests
app.use(logger('dev'));

app.get('/', function(req, res){
  res.redirect('/app');
});

app.use('/app', express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));


var port = process.env.PORT || 5000;
app.listen(port);
console.log('listening on port ' + port);
