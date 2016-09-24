const {app, BrowserWindow, ipcMain} = require('electron')
const Config = require('./app/Config')
var mpris = require('./app/mpris/mpris')
global.slasturl = Config.settings.lasturl
global.popURL = 'about:blank'

app.on('ready', function () {
  var win = new BrowserWindow({
    width: 1165,
    height: 680,
    icon: __dirname + '/resources/icon.png'
  })

  if (Config.settings.window) {
    let {width, height} = Config.settings.window
    win.setSize(width, height)
  }

  win.loadURL('file://' + __dirname + '/app/plug.html')

  mpris.init(app, win)

  win.on('close', function (event) {
    var size = win.getSize()
    Config.saveSettings(null, {
      window: {
        width: size[0],
        height: size[1]
      },
      lasturl: global.slasturl
    })
    app.quit()
  })

  ipcMain.on('songChange', function (event, str) {
    win.webContents.send('getAuthorize', str)
    event.returnValue = str
  })

  ipcMain.on('setURL', function (event, str) {
    global.slasturl = str
    event.returnValue = str
  })

  ipcMain.on('setPopURL', function (event, str) {
    global.popURL = str
    event.returnValue = str
  })
})
