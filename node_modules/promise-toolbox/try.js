"use strict";

const resolve = require("./_resolve");

module.exports = function pTry(fn) {
  try {
    return resolve(fn());
  } catch (error) {
    return Promise.reject(error);
  }
};