const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

// ipcMain.on('give-storage-path', (event, arg) => {
//   event.returnValue = app.getPath(arg)
// })

let win

function createWindow() {
  win = new BrowserWindow({
    width: 890,
    height: 480
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  win.on('closed', (event) => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
