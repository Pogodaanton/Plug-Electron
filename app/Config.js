const electron = require('electron')
const fs = require('fs')
const path = require('path')
const settings = require('../settings')

let settingsFile = path.join(electron.app.getPath('userData'), 'settings.json')
try {
  let tmpSettings = JSON.parse(fs.readFileSync(settingsFile))
  Object.assign(settings, tmpSettings)
} catch (e) {}

class Config {
  constructor (settings) {
    this.settings = settings
  }

  saveSettings (event, settings) {
    Object.assign(this.settings, settings)
    let data = JSON.stringify(this.settings, null, '\t')
    let tmpFile = settingsFile + '.tmp'

    fs.writeFile(tmpFile, data, (err) => {
      if (err) throw err
      fs.rename(tmpFile, settingsFile, (err) => {
        if (err) throw err
      })
    })
  }
}

module.exports = new Config(settings)
