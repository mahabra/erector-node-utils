const fs = require('fs');

module.exports = function isFileSync(filename) {
  try {
    let stats = fs.lstatSync(filename);
    return !stats.isDirectory();
  }
  catch (e) {
      return false;
  }
}
