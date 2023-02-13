const axios = require('axios');
const path = require('path');
const url = require('url');
const IniFile = require(path.join(__dirname, '../Libraries/ini_manager')).IniFile;


class Service {
  constructor() {
    this.settings = (new IniFile('settings')).get()
    this.gateIni = (new IniFile(this.settings.DebiGate.Path_GateWay + "user.ini", true))
  }

  async login(username, password) {
    let apihost = this.settings.ServiceSettings.APIHOST
    let apiport = this.settings.ServiceSettings.APIPORT
    let authpath = this.settings.ServiceSettings.APIPATH_AUTH
    let gateauthpath = this.settings.ServiceSettings.APIGATEPATH_AUTH

    let url = "http://" + apihost + ":" + apiport + authpath
    let gurl = "http://" + apihost + ":" + apiport + gateauthpath

    try {
      var resp = await axios({
        method: "GET",
        url: url,
        params: { username, password }
      })
      var gateresp = await axios({
        method: "GET",
        url: gurl,
        params: { username, password }
      })
    }
    catch (e) {
      if (e.code === 'ERR_BAD_REQUEST') { 
        console.log(e.response.data);
        return false; 
      }
      else throw e
    }
    console.log(this.gateIni.get());
    
    if (resp.data.Success) {
      this.token = resp.data.Token
      this.gateToken = gateresp.data.Token
      this.gatePass = gateresp.data.Data.password
      this.userData = resp.data.Data

      console.log(this.userData);

      let nGateIni = {...this.gateIni.get()}
      nGateIni.DebiGateWay.username = this.userData.username
      nGateIni.DebiGateWay.password = this.gatePass

      this.gateIni.set(nGateIni);
      console.log(this.gateIni.get());

      return true
    }
    else return false

  }

  init(browserWindow) {
    browserWindow.loadURL("http://debiapi.akatron.net/")
    browserWindow.webContents.executeJavaScript(
      'localStorage.setItem("Token", "' + this.token + '"); location.reload();', true
    )
    browserWindow.webPreferences = {
      webSecurity: false,
      allowRunningInsecureContent: true,
      allowDisplayingInsecureContent: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
    browserWindow.maximize();

  }
}


module.exports = { Service }