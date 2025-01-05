"use strict";

module.exports = function tapCatch(cb) {
  return this.then(undefined, cb).then(() => this);
};