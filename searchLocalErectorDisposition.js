const path = require('path');
const findParentDir = require('find-parent-dir');

module.exports = function searchLocalErectorDisposition(cwd) {
  return new Promise(function(resolve, reject) {
    const paths = [];
    function reFingParentDir(dir) {
      findParentDir(dir, '__erector__', function (err, dir) {
        if (err || !dir) {
          resolve(paths);
        } else {
          paths.push(path.join(dir, '__erector__'));
          reFingParentDir(path.resolve(dir, '../'));
        }
      });
    }
    reFingParentDir(cwd);
  });
}
