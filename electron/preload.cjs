// Preload script untuk komunikasi yang aman antara main process dan renderer process
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window management for borderless window
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  toggleFullScreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  getWindowState: () => ipcRenderer.invoke('get-window-state'),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // File operations (if needed)
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (content) => ipcRenderer.invoke('save-file', content),
  
  // Notifications
  showNotification: (message) => ipcRenderer.invoke('show-notification', message)
});

// Remove security warnings
delete window.module;
delete window.exports;
delete window.require;
