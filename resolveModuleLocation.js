const resolvePackage = require("./resolvePackage.js");
const path = require('path');
const isFileSync = require('./isFileSync.js');
const isDirSync = require('./isDirSync.js');
const searchLocalErectorDisposition = require('./searchLocalErectorDisposition.js');

function getFileWithExtensions(resourceName, extensions) {
  for (let i = 0; i < extensions.length; i++) {
    const filename = resourceName+extensions[i];
    if (isFileSync(filename)) {
      return filename;
    }
  }
}

module.exports = function resolveModuleLocation(moduleName, cwd) {
  return Promise.resolve()
  .then(function() {
    const localFile = path.resolve(cwd, moduleName);
    if (isFileSync(localFile)) {
      resolve(localFile);
    } else {
      return searchLocalErectorDisposition(cwd)
      .then(function(dirs) {
        for (let i = 0; i < dirs.length; i++) {
          const resourceName = path.join(dirs[i], moduleName);
          const indexFilename = path.join(resourceName, 'index');
          const existenFilename = getFileWithExtensions(isDirSync(resourceName) ? indexFilename : resourceName, ['.js', '.es', '.coffee', '.ts']);
          return existenFilename ? existenFilename : Promise.reject();
        }
        return Promise.reject();
      })
      .catch(function(e) {
        console.log('What', e.message);
        const location = resolvePackage(moduleName);
        if (location instanceof Error) {
          return location.message;
        }
        return location;
      });
    }
  })
}
