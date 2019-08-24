$(function() {

  var socket = io();

  // var $videoClass = $('.videoClass'); //Listing 

  // **** Socket Events ****

  socket.on('voice_text', (data) => {
    // Display home status
    displayHomeStatus(data);
  });

  
});







