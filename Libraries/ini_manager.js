const fs = require('fs');
const ini = require('ini');
const path = require('path');

class IniFile {
  constructor(ini_name) {
    this.filepath = path.join(__dirname, "../" + ini_name + ".ini")
  }

  get() {
    return ini.parse(fs.readFileSync(this.filepath, 'utf-8'))
  }

  set(newIniJSON) {
    fs.writeFileSync(this.filepath, ini.stringify(newIniJSON))
  }
}



module.exports = { IniFile }