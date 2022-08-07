const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('serialportsAPI',{
  listSerialPorts: () => ipcRenderer.invoke('serialport:list')
})

contextBridge.exposeInMainWorld('socketAPI',{
  listSockets: () => ipcRenderer.invoke('socket:list')
})