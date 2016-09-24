// Load in our dependencies
var ipcMain = require('electron').ipcMain
var MprisService = require('mpris-service')

// Define a function to set up mpris
exports.init = function (app, win) {
  // https://github.com/emersion/mpris-service/tree/a245730635b55c8eb06c605f4ece61e251f04e20
  // https://github.com/emersion/mpris-service/blob/a245730635b55c8eb06c605f4ece61e251f04e20/index.js
  // http://www.freedesktop.org/wiki/Specifications/mpris-spec/metadata/
  // http://specifications.freedesktop.org/mpris-spec/latest/Player_Interface.html
  var mpris = new MprisService({
    name: 'Plug-dj-Web-App'
  })

  mpris.on('quit', function () {
    app.quit()
  })

  mpris.on('raise', function () {
    app.focus()
  })

  mpris.on('playpause', function () {
    win.webContents.send('mpris:playpause', 'whoooooooh!')
  })

  mpris.on('stop', function () {
    win.webContents.send('mpris:playpause', 'whoooooooh!')
  })

  mpris.on('next', function () {
    win.webContents.send('mpris:next', 'whoooooooh!')
    mpris.playbackStatus = 'Stopped'
  })

  mpris.on('previous', function () {
    win.webContents.send('mpris:prev', 'whoooooooh!')
  })

  /* mpris.on('previous', gme.controlPrevious)*/
  // Currently position and seek aren't supported due to not receiving events in Cinnamon =(
  // DEV: Stop isn't supported in Google Music (unless it's pause + set position 0)
  // DEV: We choose to let the OS volume be controlled by MPRIS
  setTimeout(function () {
    mpris.metadata = {
      // Convert milliseconds to microseconds (1s = 1e3ms = 1e6µs)
      'mpris:length': 0 * 1000 * 1000, // In microseconds
      'mpris:artUrl': '',
      'xesam:title': '',
      'xesam:album': '',
      'xesam:artist': ''
    }

    mpris.playbackStatus = 'Stopped'
    console.log(mpris.metadata)
  }, 2000)

  // var songInfo = {}
  ipcMain.on('change:song', function handleSongChange (evt, _songInfo) {
    var media = JSON.parse(_songInfo).media
    mpris.metadata = {
      'mpris:artUrl': media.image,
      // Convert milliseconds to microseconds (1s = 1e3ms = 1e6µs)
      'mpris:length': media.duration * 1e3,
      'xesam:album': '',
      'xesam:artist': media.author,
      'xesam:title': media.title
    }

    console.log(mpris.metadata)
  })

  ipcMain.on('change:playpause', function handleSongPlaypause (evt, data) {
    if (data === 'true') mpris.playbackStatus = 'Stopped'
    else mpris.playbackStatus = 'Playing'
  })
}

  /*

  ipcMain.on('change:playback-time', function handlePlaybackUpdate (evt, playbackInfo) {
    // Convert milliseconds to microseconds (1s = 1e3ms = 1e6µs)
    var newPosition = playbackInfo.current * 1e3
    var newTotal = playbackInfo.total * 1e3

    // If the total has been updated, update our songInfo cache
    // DEV: This is due to `google-music.js` not always having an up to date length upon song change
    if (songInfo['mpris:length'] !== newTotal) {
      mpris.metadata = _.extend(songInfo, {
        'mpris:length': newTotal
      })
    }

    // If our position varies by 2 seconds, consider it a seek
    // DEV: Seeked takes the delta (positive/negative depending on position
    var delta = newPosition - mpris.position
    if (Math.abs(delta) > 2e6) {
      mpris.seeked(delta)
    }
  })

  var playbackStrings = {}
  playbackStrings[GoogleMusic.Playback.PLAYING] = 'Playing'
  playbackStrings[GoogleMusic.Playback.PAUSED] = 'Paused'
  playbackStrings[GoogleMusic.Playback.STOPPED] = 'Stopped'
  ipcMain.on('change:playback', function handlePlaybackChange (evt, playbackState) {
    mpris.playbackStatus = playbackStrings[playbackState]
  })*/
