const { Server } =  require('socket.io')
var fs = require('fs');

//const createTable = require('data-table');

function handler(req, res) {
    //console.log(__dirname + '/public' + req.url);
    url = req.url;
    if(req.url == "/socket.io-client") {
      url += ".min.js";
    }
    fs.readFile(__dirname + '/public' + url,
      function (err, data) {
        if (err) {
          res.writeHead(404);
          return res.end('Not found');
        }
        res.writeHead(200);
        res.end(data);
      });
  }

var http = require('http').createServer(handler)
var io = new Server(http, {
    cors: {
        origin: "*",
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true
      }    
});
http.listen(4268);

io.sockets.on('connection', function (socket) {
  console.log(socket)


  socket.on('OUTPUT', function (data) {
    console.log('OUTPUT', data);
  })

})


module.exports = {
    io: io
  };