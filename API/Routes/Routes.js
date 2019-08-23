'use strict';
var express = require('express');
module.exports = function(app) {

var googleHomeController = require('../Controllers/GoogleHomeController');
var raspberrypiSensorController = require('../Controllers/RaspberrypiScreenController');
var raspberrypiPersonController = require('../Controllers/RaspberrypiPersonController');
var fitbitDataController = require('../Controllers/FitbitDataController');
var apiRoutes =  express.Router();

  // google home Route
  app.route('/dialogflowFulfillment')
    .post(googleHomeController.processRequest);

  // screen status route
  app.route('/raspberrypiSensorStatus')
    .post(raspberrypiSensorController.processRequest);

    // person route
  app.route('/raspberrypiPersonStatus')
  .post(raspberrypiPersonController.processRequest);
 

  // fitbit route
  app.route('/fitbitData')
  .post(fitbitDataController.processRequest);
}; 
 