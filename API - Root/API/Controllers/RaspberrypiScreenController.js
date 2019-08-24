'use strict';

var io = require('socket.io');
var saveToDatabase = require("../Model/SaveToDatabase.js");

exports.SetIO = function(IO){
    io = IO;
}

exports.processRequest = function(req, res) {
    
    saveToDatabase.saveDB(JSON.stringify
        ({"Speech" : "Hello", "Username" : "Nipun"}));
        
    io.emit('screen_status', {
        message: req.body
      });

    return res.json({
        status: 'true'
    });
};