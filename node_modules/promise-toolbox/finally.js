"use strict";

module.exports = function pFinally(cb) {
  return this.then(cb, cb).then(() => this);
};