
var five = require('johnny-five');
const { SerialPort } = require('serialport')

/*
const port = new SerialPort({ path: "/dev/tty.usbserial-A94FS1TK", baudRate: 115200 })

this.board = new five.Board({
  port: port,
  repl: false
});

this.board.on("ready", function() {
  var led = new five.Led(13);
  led.blink(500);
});    

*/
function Serial() {
  this.serialport = SerialPort;
  this.port = false;
  this.board = false;
  this.connected = false;

  this.connect = async function(port, errorCallback) {
    var me = this;
    if(this.port && this.port.port) {
      if(this.port.port.isOpen) {
        this.port.port.close();
      }
    }
    return await SerialPort.list().then(ports => {
      p = ports.filter(o => {return o.path == port});
      //console.log(port, p.length)
      if(p.length) {
        _port = new SerialPort({ path: port, baudRate: 115200 })
        this.board = new five.Board({
          port: _port,
          repl: false
        });

        this.board.on("error", function (err) {
          console.log("ERROR TIMEOUT");
          me.connected = false;
          errorCallback({"type": "error", "msg" :err});
        })     
        
        this.board.on("close", function (err) {
          console.log("ERROR CLOSE ");
          me.connected = false;
          errorCallback({"type": "disconnect", "msg" :"Board disconnected"});
        })        
        
        this.board.on("ready", function() {
          me.port = _port;
          me.connected = true;
          var led = new five.Led(13);
          //led.blink(500);
        });    
        
        return 1;
      } else {
        console.log("No existe el puerto: ", port);          
        errorCallback({"type": "error", "msg": "No existe el puerto: "+ port });
        return 0;
      }

  })
}

  this.isConnected = function() {
    return this.connected;
  }

}

module.exports = {
  serial: new Serial()
}


