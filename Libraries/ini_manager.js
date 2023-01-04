const fs = require('fs');
const ini = require('ini');
const path = require('path');

class IniFile {
  constructor(iniPath, fullPath = false) {
    if (fullPath) {
      this.filepath = iniPath
    }
    else this.filepath = path.join(__dirname, "../" + iniPath + ".ini")
  }

  get() {
    return ini.parse(fs.readFileSync(this.filepath, 'utf-8'))
  }

  set(newIniJSON) {
    fs.writeFileSync(this.filepath, ini.stringify(newIniJSON))
  }
}



module.exports = { IniFile }