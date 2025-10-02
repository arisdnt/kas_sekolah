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

// Remove security warnings and hide Electron traces
delete window.module;
delete window.exports;
delete window.require;

// Hide Electron-specific global variables
window.addEventListener('DOMContentLoaded', () => {
  // Remove Electron process info
  if (window.process && window.process.versions && window.process.versions.electron) {
    delete window.process.versions.electron;
  }
  
  // Hide other Electron indicators
  delete window.chrome;
  delete window.webkitURL;
  
  // Prevent access to Node.js globals
  if (typeof global !== 'undefined') {
    delete global.process;
    delete global.Buffer;
    delete global.require;
  }
});
