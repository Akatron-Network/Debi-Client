const axios = require('axios');
const path = require('path');
const IniFile = require(path.join(__dirname, '../Libraries/ini_manager')).IniFile;


class Service {
  constructor() {
    this.settings = (new IniFile('settings')).get()
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
    
    if (resp.data.Success) {
      this.token = resp.data.Token
      this.gateToken = gateresp.data.Token
      this.userData = resp.data.data
      return true
    }
    else return false

  }

  init(browserWindow, gateUserIni) {
    browserWindow.webContents
    .executeJavaScript('location.href = "http://debiapi.akatron.net:3000/";', true)
    .then(result => {
      browserWindow.webContents.executeJavaScript('localStorage.setItem("Token", "' + this.token + '");', true).then(result => {
        browserWindow.reload();
      })
    })

    browserWindow.maximize();

  }
}


module.exports = { Service }