(function() {
  var io;

  function recurse(socket) {
    setTimeout(function() {
      socket.emit('draw', 
        { pitch : Math.random()
        , fenv  : Math.random()
        , dist  : Math.random()
        });
      recurse(socket);
    }, 50+500*Math.random());
  }

  io = require('socket.io').listen(4000);
  io.sockets.on('connection', function(socket) {
    recurse(socket);
  });
}).call(this);