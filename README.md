#Plug-Electron

[![Greenkeeper badge](https://badges.greenkeeper.io/Pogodaanton/Plug-Electron.svg)](https://greenkeeper.io/)
This is a web-wrapper of [plug.dj](http://plug.dj), so you can use it more like a music player and less like a website.

Until now there is the basic app and only small additional features like:
* MPRIS support (Music Player controls for Linux)
* Script manager (So you can load your favourite scripts to plug.dj)

For creating a connection between plug.dj and the client I created [a script](https://github.com/Pogodaanton/PlugAssist), which is being implemented to the site at the start of Plug-Electron.

#For Requests, Bug Reports, etc.
Please head over to [the issues site](https://github.com/Pogodaanton/Plug-Electron/issues)

#Developers, ahoi
I always appreciate if you contribute on this project. I tried to make the most user-friendly workspace setup I ever made, however there are still some catches.

* You can install all depencies via `npm install`
* Next step is to rebuild *mpris-service* for electron. Do that by typing in `npm run rebuild`.
* **Note:** If you want to tinker with [PlugAssist](https://github.com/Pogodaanton/PlugAssist), you have to upload the file to a web-server, as the <webview/> may not load local files. Additionally the url has to start with `https://`.
