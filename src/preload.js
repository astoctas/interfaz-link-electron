const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('serialportAPI',{
  listSerialPorts: () => ipcRenderer.invoke('serialport:list'),
  connect: (port) => ipcRenderer.invoke('serialport:connect', port),
  connected: () => ipcRenderer.invoke('serialport:connected'),
  relaunch: () => ipcRenderer.invoke('serialport:relaunch'),
  handleError: (callback) => ipcRenderer.on('serialport:handleError', callback)

})

contextBridge.exposeInMainWorld('socketAPI',{
  listSockets: () => ipcRenderer.invoke('socket:list')
})