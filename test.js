var five = require('johnny-five');
const { SerialPort } = require('serialport')

/*
*/
const port = new SerialPort({ path: "/dev/tty.usbserial-A94FS1TK", baudRate: 115200 })

this.board = new five.Board({
  port: this.port,
  repl: false
});

this.board.on("ready", function() {
  var led = new five.Led(13);
  led.blink(500);
}); 