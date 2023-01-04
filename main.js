const electron = require('electron')
const url = require('url')
const path = require('path');
const axios = require('axios');
const IniFile = require(path.join(__dirname, 'Libraries/ini_manager')).IniFile;
const Service = require(path.join(__dirname, 'Methods/Service')).Service;

const {app, BrowserWindow, Menu, ipcMain, nativeImage} = electron

let mainWindow, consoleWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    maximizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: true,
      allowDisplayingInsecureContent: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  mainWindow.setIcon(nativeImage.createFromPath('ico.png'))
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "Templates/index.html"),
    protocol: "file",
    slashes: true
  }))

  mainWindow.on('close', () => {
    app.exit();
  })

  consoleWindow = new BrowserWindow({
    autoHideMenuBar: true,
    // show: false,
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: true,
      allowDisplayingInsecureContent: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  
  consoleWindow.setIcon(nativeImage.createFromPath('ico.png'))
  consoleWindow.loadURL(url.format({
    pathname: path.join(__dirname, "Templates/console.html"),
    protocol: "file",
    slashes: true
  }))

  consoleWindow.hide();
  consoleWindow.on('close', (event) => {
    event.preventDefault()
    consoleWindow.hide()
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate))

  ipcMain.on('login', async (err, data) => {
    let service = new Service();
    let log_resp = await service.login(data.username, data.password);
    console.log(log_resp);
    if (log_resp) service.init(mainWindow, undefined);
    else mainWindow.webContents.executeJavaScript('loginerr();', true)
  })

})



const mainMenuTemplate = [
  {
    label: "Dosya",
    submenu: [
      {
        label: "Yenile",
        role: "reload"
      },
      {
        label: "Konsol",
        click(item, focusedWindow) { focusedWindow.toggleDevTools() }
      },,
      {
        label: "GateWay",
        click(item, focusedWindow) { consoleWindow.show() }
      },
      {
        label: "Çıkış",
        role: "quit"
      }
    ]
  }
]