

var $sel = document.getElementById('select-ports');
$sel.innerHTML = "";

const b = window.serialportsAPI.listSerialPorts()
b.then(c => console.log(c))

var socketPort = 4268;

const _ips = window.socketAPI.listSockets();
_ips.then(ips => {
    ips.forEach(function(i,v){
        document.getElementById("socket-msg").innerHTML = (document.getElementById("socket-msg").innerHTML +i+":"+socketPort+ "<br/>");
      })
})

M.AutoInit();
