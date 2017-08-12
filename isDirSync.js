const fs = require('fs');

module.exports = function isDir(filepath) {
  try {
    let stats = fs.lstatSync(filepath);
    return stats.isDirectory();
  }
  catch (e) {
    return false;
  }
}
