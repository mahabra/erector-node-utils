const fs = require('fs');
const path = require('path');
const isDirSync = require('./isDirSync');

module.exports = function getErectorScriptNamesInDirectory(dirName) {
  return fs.readdirSync(dirName)
    .map(function(fn) {
      if (!/[\.]/.test(fn) && isDirSync(path.join(dirName, fn))) {
        return fn;
      } else if (/\.js$/.test(fn)) {
        return path.basename(fn, '.js');
      } else {
        return false;
      }
    })
    .filter(function(scriptName) {
      return !!scriptName;
    });
}
