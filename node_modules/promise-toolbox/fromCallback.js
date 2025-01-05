"use strict";

function resolver(fn, args, resolve, reject) {
  args.push((error, result) => error != null && error !== false ? reject(error) : resolve(result));
  fn.apply(this, args);
}

module.exports = function fromCallback(fn, ...args) {
  return new Promise(resolver.bind(this, typeof fn === "function" ? fn : this[fn], args));
};