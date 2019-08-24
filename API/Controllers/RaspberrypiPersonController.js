'use strict';

var io = require('socket.io');
var saveToDataBase = require("../Model/SaveToDatabase.js");
exports.SetIO = function(IO){
    io = IO;
}

exports.processRequest = function(req, res) {
    console.log("Raspberrypi person status req");

    io.emit('person_status', {
        message: req.body
      });

    return res.json({
        status: 'true'
    });
};
