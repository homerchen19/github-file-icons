"use strict";

const resolve = require("./_resolve");

const wrapApply = (fn, args, thisArg) => {
  try {
    return resolve(fn.apply(thisArg, args));
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = wrapApply;