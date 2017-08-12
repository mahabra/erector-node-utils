"use strict";
const path = require('path');
const requireg = require('requireg');
const npmErectModuleExpr = /^erector-[a-z0-9\-_]+$/i;
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');


/**
 * Resolve erector package location (includes global packages). Returns a path to main file of package ot throws an error.
 *
 * @example
 * resolvePackage('hello', {
 *   before: function(name, resolvePackage, opt) {
 *     if (myAliases.includes(name)) {
 *       return myAliases[name];
 *     }
 *     throw new Error('Package name is not in aliases');
 *   }
 * })
 *
 * @param  {string} name Name of erector package (without prefix, but prefix is allowed)
 * @param  {type} opt       Options
 * @param  {type} opt.before Function resolver, which will be called before (must return string or throw an error)
 * @param  {type} opt.after Function resolver, which will be called after last fail (must return string or throw an error)
 * @return {string} Full filename
 */
module.exports = function resolvePackage(name, opt) {
  opt = Object.assign(
    {
      before: undefined,
      after: undefined,
    },
    isPlainObject(opt) ? opt : {}
  );
  return Promise.resolve(name)
  .then(function(name) {
    if (isFunction(opt.before)) {
      return Promise.resolve(name)
      .then(function(name) {
        return opt.before(name, resolvePackage, opt);
      });
    }
    return Promise.reject(name);
  })
  .catch(function(name) {
    const packageName = !npmErectModuleExpr.exec(name) ? 'erector-'+name : name;
    try {
      return require.resolve(packageName);
    } catch(e) {
      try {
        if (e.code=='MODULE_NOT_FOUND') {
          let localPath = path.join(process.cwd(), 'node_modules', packageName);
          return require.resolve(localPath);
        } else {
          throw new Error(`Package ${packageName} have errors: `+e.message+' '+e.stack);
        }
      } catch(e) {
        if (e.code=='MODULE_NOT_FOUND') {
          try {
            let filename = requireg.resolve(packageName);
            if (!filename) {
              if (e.code=='MODULE_NOT_FOUND'||~e.message.indexOf('Cannot find global module')) {
                if (isFunction(opt.after)) {
                  try {
                    return Promise.resolve(name)
                    .then(function(name) {
                      return opt.after(name, resolvePackage, opt);
                    });
                  } catch(e) {
                    throw new Error('Package `'+name+'` is not exists');
                  }
                } else {
                  throw new Error('Package `'+name+'` is not exists');
                }
              } else {
                let shortPackageName = (packageName.split('/').pop());
                return new Error('Package '+shortPackageName+' has an errors. Run `erector debug '+packageName+'` to find a problem.');
              }
            } else {
              return filename;
            }
          } catch(e) {
            throw new Error("Undefined module `"+packageName+"`");
          }
        } else {
          throw e;
        }
      }
    }
  });
}
