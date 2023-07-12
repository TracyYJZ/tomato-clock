// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const path = require('path')

function handleIPC() {
  ipcMain.handle('notification', async (e, {body, title, actions, closeButtonText}) => {
      let res = await new Promise((resolve, reject) => {
          console.log({
              title,
              body,
              actions,
              closeButtonText
          })
          let notification = new Notification({
              title,
              body,
              actions,
              closeButtonText
          })
          notification.show()
          notification.on('action', function(event) {
              resolve({event: 'action'})
          })
          notification.on('close', function(event) {
              resolve({event: 'close'})
          })
      })
      return res
  })
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 250,
    height: 350,
    webPreferences: {
      //  渲染进程 开启node模块，使得JS中可以使用node的model
      nodeIntegration:true,
      // 开启 remote 模块
      enableBlinkFeatures:true,
      // 控制上下文隔离
      contextIsolation:false,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
