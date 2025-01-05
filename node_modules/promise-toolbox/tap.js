"use strict";

module.exports = function tap(onFulfilled, onRejected) {
  return this.then(onFulfilled, onRejected).then(() => this);
};