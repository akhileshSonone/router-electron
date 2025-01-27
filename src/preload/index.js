import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  getBackendURL: () => {
    return new Promise((resolve) => {
      ipcRenderer.once('get-backend-url', (event, url) => {
        resolve(url)
      })
      ipcRenderer.send('get-backend-url')
    })
  },
  onUpdateStatus: () => {
    return new Promise((resolve) => {
      ipcRenderer.on('update-status', (_, status) => {
        resolve(status)
      })
      ipcRenderer.send('update-status')
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
