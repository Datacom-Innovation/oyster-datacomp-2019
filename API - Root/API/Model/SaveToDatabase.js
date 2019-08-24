var request = require('request');

module.exports.saveDB = function (information) { 
    console.log(information);
    request.post("https://magicmirroreasytables.azurewebsites.net/tables/MagicMirrorInformation", { body : information, headers : {'ZUMO-API-VERSION' : '2.0.0'}}, function(err, res, body) {
        if (!err && res.statusCode === 200) {
            console.log("here you go");
            processOutput(body, function(err, output) {
                console.log("here you go", err, output);
            });
        }
    });
  }
  
  function processOutput(input, callback) {
      // process input
      callback(null, input);
  }