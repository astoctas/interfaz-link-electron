const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('serialportsAPI',{
  listSerialPorts: () => ipcRenderer.invoke('serialport:list')
})