"use strict";

const isArray = Array.isArray,
      slice = Array.prototype.slice;

const chain = (promise, fn) => promise.then(fn);

module.exports = function pPipe(fns) {
  if (!isArray(fns)) {
    fns = slice.call(arguments);
  }

  if (typeof fns[0] !== "function") {
    fns[0] = Promise.resolve(fns[0]);
    return fns.reduce(chain);
  }

  return arg => fns.reduce(chain, Promise.resolve(arg));
};