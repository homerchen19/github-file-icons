"use strict";

const setFunctionNameAndLength = require("./_setFunctionNameAndLength");

module.exports = function unpromisify() {
  const fn = this;
  return setFunctionNameAndLength(function () {
    const n = arguments.length - 1;
    let cb;

    if (n < 0 || typeof (cb = arguments[n]) !== "function") {
      throw new Error("missing callback");
    }

    const args = new Array(n);

    for (let i = 0; i < n; ++i) {
      args[i] = arguments[i];
    }

    fn.apply(this, args).then(result => cb(undefined, result), reason => cb(reason));
  }, fn.name, fn.length + 1);
};