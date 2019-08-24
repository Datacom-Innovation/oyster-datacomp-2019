// Setup basic express server
// testing
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var bodyParser   = require('body-parser');


// var io = require('../..')(server);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./API/Routes/Routes'); //importing route
routes(app); //register the route

var googleHomeController = require('./API/Controllers/GoogleHomeController'); //importing route
googleHomeController.SetIO(io);

var raspberrypiScreenController = require('./API/Controllers/RaspberrypiScreenController'); //importing route
raspberrypiScreenController.SetIO(io);

var raspberrypiPersonController = require('./API/Controllers/RaspberrypiPersonController'); //importing route
raspberrypiPersonController.SetIO(io);

var fitbitDataController = require('./API/Controllers/FitbitDataController'); //importing route
fitbitDataController.SetIO(io);

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

