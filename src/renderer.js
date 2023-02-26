
M.AutoInit();

// LISTAR SOCKETS
var socketPort = 4268;
const _ips = window.socketAPI.listSockets();
_ips.then(ips => {
    ips.forEach(function(i,v){
        document.getElementById("socket-msg").innerHTML = (document.getElementById("socket-msg").innerHTML +i+":"+socketPort+ "<br/>");
      })
})


// LISTAR PUERTOS
var portlist = [];
var serialport;
var $sel = document.getElementById('select-ports');
var firstTime = true;

function saveAndConnect(port) {
  window.localStorage.setItem("port", port);
  window.serialportAPI.relaunch()      
}

function portsChange() {

  const b = window.serialportAPI.listSerialPorts()
  b.then(p => {
    //console.log(p, portlist) 
    if(p.length == portlist.length) return;
    $sel.innerHTML = "";
    /*
    var el = document.createElement("option");
    el.text = "Automático";
    el.value  =  "auto";
    $sel.appendChild(el);
    */
    p.forEach(port => {
      let el = document.createElement("option");
      el.text = port.path + (port.manufacturer ? " "+port.manufacturer : "");
      el.value  =  port.path;
      $sel.appendChild(el);
    })
    M.FormSelect.init($sel, {});  

    // CONECTAR AL NUEVO PUERTO SI ESTA DESCONECTADO 
    let newports = p.filter(x => !portlist.includes(x.path)) ;
    console.log(newports);
    if(!firstTime)
    window.serialportAPI.connected().then(v => {
      if(!v) {
        if(newports.length == 1) {
          saveAndConnect(newports[0].path);
        } 
      }
    });
    firstTime = false;
    
    portlist = []; 
    p.forEach(port => {
      portlist.push(port.path);
    })

  })
}


// INIT
var connectBtn = document.getElementById('connectBtn');
var errorMsg = document.getElementById("error-msg");
var connectedMsg = document.getElementById("connected-msg");
var disconnectedMsg = document.getElementById("disconnected-msg");
var notificationTitle = "Interfaz ";

disconnectedMsg.classList.remove("hide");
setInterval(portsChange, 2000);

window.serialportAPI.handleConnectCallback((event, value) => {
  console.log(value);
  if(value.type == "connect") {
    errorMsg.classList.add("hide");
    disconnectedMsg.classList.add("hide");
    connectedMsg.classList.remove("hide");
    // TODO IDENTIFICAR MODELO
    model = "interfaz";
    if(model == "rasti") {
      notificationTitle += "Rasti";
    } else {
      notificationTitle += "Robótica";
    }    
    let myNotification = new Notification(notificationTitle, {
      body: value.msg
    })    
  }
  if(value.type == "error") {
    errorMsg.classList.remove("hide");
    return;
  }
  if(value.type == "disconnect") {
    disconnectedMsg.classList.remove("hide");
    connectedMsg.classList.add("hide");
    let myNotification = new Notification(notificationTitle, {
      body: 'Interfaz desconectada'
    })       
  }
})

connectBtn.addEventListener("click", function () {
  saveAndConnect($sel.value);
})

if(port = window.localStorage.getItem("port")) {
  console.log("Conectando al inicio a ", port);
  window.serialportAPI.connect(port).then(r => {
  })
}