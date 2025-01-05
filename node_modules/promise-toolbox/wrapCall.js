"use strict";

const resolve = require("./_resolve");

const wrapCall = (fn, arg, thisArg) => {
  try {
    return resolve(fn.call(thisArg, arg));
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = wrapCall;