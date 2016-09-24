var electron = require('electron')
var {webview, ipcRenderer, remote, shell} = electron // eslint-disable-line
var {Menu, MenuItem} = remote
var fs = require('fs') // eslint-disable-line
var path = require('path') // eslint-disable-line
var url = require('url') // eslint-disable-line

let rightClickPosition = null
var scriptAdded = false

var plugView = document.getElementById('plug-view')
var title = document.querySelector('title')

plugView.addEventListener('dom-ready', start)

function start () {
  plugView.removeEventListener('dom-ready', start)

  plugView.loadURL(remote.getGlobal('slasturl'))
  plugView.setAudioMuted(false)
}

plugView.addEventListener('page-title-updated', function (event) {
  // let currentURL = url.parse(plugView.getURL(), true)
  if (event.title.indexOf('Dashboard') === -1 && event.title !== ' - plug.dj' && !scriptAdded) {
    if (!plugView.isLoading()) {
      setTimeout(function () {
        plugView.executeJavaScript('$.getScript("https://cdn.rawgit.com/Pogodaanton/PlugAssist/master/PlugAssist.js");')
        scriptAdded = true
      }, 500)
    } else console.log('[PlugView] I\'m still loading, can\'t load any script yet!')
  }

  ipcRenderer.send('setURL', plugView.getURL())
  title.innerHTML = event.title
})

plugView.addEventListener('console-message', function (e) {
  if (e.message.indexOf('[PlugBridge]') >= 0) {
    var substrlength = e.message.split(' ')[0].length + 1 + e.message.split(' ')[1].length + 1
    var substrvar = e.message.substr(substrlength)
    switch (e.message.split(' ')[1].substr(0, e.message.split(' ')[1].length)) {
      case 'getScriptList':
        plugView.executeJavaScript('(' + substrvar + ')();')
        break
      case 'songChange':
        ipcRenderer.send('change:song', substrvar)
        break
      case 'playPause':
        ipcRenderer.send('change:playpause', substrvar)
        break
      default:
        console.log('Undefined PlugBridge message: ' + e.message)
    }
  } else console.log(e.message)
})

plugView.addEventListener('new-window', function (event) {
  let protocol = url.parse(event.url).protocol

  if (protocol === 'http:' || protocol === 'https:') {
    shell.openExternal(event.url)
  }
})

plugView.addEventListener('dragover', function (event) {
  event.preventDefault()
  return false
}, false)

plugView.addEventListener('drop', function (event) {
  event.preventDefault()
  return false
}, false)

ipcRenderer.on('mpris:playpause', function (event, message) {
  plugView.executeJavaScript('pa.togglePlayback()')
})

ipcRenderer.on('mpris:next', function (event, message) {
  plugView.executeJavaScript('pa.setSnooze()')
})

ipcRenderer.on('mpris:prev', function (event, message) {
  plugView.executeJavaScript('pa.playPrevious()')
})

const debugMenu = new Menu()
const debugLabel = new MenuItem({
  label: 'Debug Menu',
  enabled: false
})

const debugSeperator = new MenuItem({
  type: 'separator',
  enabled: false
})

const inspectElement = new MenuItem({
  label: 'Inspect Element',
  click: function () {
    plugView.inspectElement(rightClickPosition.x, rightClickPosition.y)
  }
})

debugMenu.append(debugLabel)
debugMenu.append(debugSeperator)
debugMenu.append(inspectElement)

window.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  if (e.ctrlKey) {
    rightClickPosition = {x: e.x, y: e.y}
    debugMenu.popup(remote.getCurrentWindow())
  }
}, false)
