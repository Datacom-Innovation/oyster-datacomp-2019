'use strict';

var io = require('socket.io');
exports.SetIO = function(IO){
    io = IO;
}

exports.processRequest = function(req, res) {
    console.log("Fitbit req");

    io.emit('fitbit_data', {
        message: req.body
      });

    return res.json({
        status: 'true'
    });
};
