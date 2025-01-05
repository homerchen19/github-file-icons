"use strict";

const isProgrammerError = require("./_isProgrammerError");

const cb = error => {
  if (isProgrammerError(error)) {
    throw error;
  }
};

module.exports = function ignoreErrors() {
  return this.then(undefined, cb);
};