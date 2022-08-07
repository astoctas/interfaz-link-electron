const {app, Menu, Tray, BrowserWindow, nativeImage, globalShortcut, ipcMain} = require('electron')
var path = require('path');
var os = require('os');

const { SerialPort } = require('serialport')

const io = require("./src/server.js")
require("./src/serial.js")


async function listSerialPorts() {
    const ports  =  await SerialPort.list();
    return ports;
}

async function listSockets() {
  var ifaces = os.networkInterfaces();
  var ips = new Array("127.0.0.1");
  
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
  
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      ips.push(iface.address);
  
      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      ++alias;
    });
  });
  return ips;
}


/*
require('electron-reload')(__dirname,{
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
  */
  let tray = null
  
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow
  Menu.setApplicationMenu(null)

const createWindow = () => {

    app.setAppUserModelId("ar.robotica"); // set appId from package.json

    globalShortcut.register('CommandOrControl+T', () => {
      mainWindow.webContents.openDevTools()
    })

     mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: { backgroundThrottling: false,
        autoHideMenuBar: true, nodeIntegration: true, contextIsolation: true, preload: path.join(__dirname, 'src/preload.js') },
    icon: path.join(__dirname, 'resources','64.png')

    })
  
    mainWindow.loadFile('index.html')
  



  // Open the DevTools.
  if(!app.isPackaged)
  mainWindow.webContents.openDevTools()
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('close', function (event) {
    if(!app.isQuiting){
        event.preventDefault();
        mainWindow.hide();
    }

    return false;
});


var  iconPath = os.platform() == 'win32' ? path.join(__dirname,'resources', '64.png') : 'resources/64.png';
var trayIcon = nativeImage.createFromPath(iconPath);
if (process.platform == 'darwin') {
  trayIcon = trayIcon.resize({ width: 16, height: 16 });
}
tray = new Tray(trayIcon)
const contextMenu = Menu.buildFromTemplate([
{ label: 'Abrir', type: 'normal', click:  function() {
  mainWindow.show();
} 
},
{ label: 'Salir', type: 'normal', click:  function() {app.isQuiting = true; app.quit()} }
])
  tray.setToolTip('Interfaz Link')
  tray.setContextMenu(contextMenu)

  /*
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
  */

}



  app.allowRendererProcessReuse = false
  app.commandLine.appendSwitch("disable-renderer-backgrounding");
  app.commandLine.appendSwitch("disable-background-timer-throttling");

  app.whenReady().then(() => {
    ipcMain.handle('serialport:list', listSerialPorts)
    ipcMain.handle('socket:list', listSockets)

    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

