import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import dotenv from 'dotenv'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { createServer } from 'http'
import { join, normalize } from 'path'
import icon from '../../resources/icon.png?asset'

import { closeDb, initDb } from '../backend/db'
import expressApp from '../backend/server'

dotenv.config({
  path: normalize(join(__dirname, '../../.env'))
})

const PORT = process.env.PORT || 10114
const server = createServer(expressApp)
let mainWindow = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: normalize(join(__dirname, '../preload/index.js')),
      sandbox: false
    }
  })

  // Set up auto-updater event handlers
  setupAutoUpdater()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()

    // Check for updates after window is shown
    autoUpdater.checkForUpdates().catch((err) => {
      console.error('Error checking for updates:', err)
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // send url to renderer process
  ipcMain.on('get-backend-url', (event) => {
    event.reply('get-backend-url', `http://localhost:${PORT}/api/v1`)
  })

  // Add update-related IPC handlers
  ipcMain.handle('check-for-updates', () => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.error('Error checking for updates:', err)
    })
  })

  // HMR for renderer base on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(normalize(join(__dirname, '../renderer/index.html')))
  }

  return mainWindow
}

function setupAutoUpdater() {
  if (is.dev) {
    // Skip auto-update in development
    return
  }

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'akhileshSonone',
    repo: 'router-electron'
  })
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('error', (err) => {
    sendUpdateMessage('error', `Update error: ${err.message}`)
  })

  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage('info', 'Checking for updates...')
  })

  autoUpdater.on('update-available', (info) => {
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: `Version ${info.version} is available.`,
        detail: 'Would you like to download and install the update?',
        buttons: ['Download', 'Later'],
        cancelId: 1
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.downloadUpdate().catch((err) => {
            console.error('Error downloading update:', err)
            sendUpdateMessage('error', `Download failed: ${err.message}`)
          })
        }
      })
  })

  autoUpdater.on('update-not-available', () => {
    sendUpdateMessage('info', 'Your application is up to date.')
  })

  autoUpdater.on('download-progress', (progressObj) => {
    const message = `Downloaded ${Math.round(progressObj.percent)}%`
    sendUpdateMessage('progress', message)
  })

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'Update has been downloaded',
        detail: 'The application will restart to install the update.',
        buttons: ['Restart Now', 'Later'],
        cancelId: 1
      })
      .then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall(false, true)
        }
      })
  })
}

function sendUpdateMessage(type, message) {
  if (!mainWindow) return

  mainWindow.webContents.send('update-status', {
    type,
    message
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  server.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`)
  })
  initDb()
  setupAutoUpdater()

  autoUpdater.checkForUpdatesAndNotify()

  setInterval(() => autoUpdater.checkForUpdatesAndNotify(), 60 * 60 * 1000)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (server) {
    console.log('Shutting server gracefully')
    server.close()
  }
  closeDb()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
