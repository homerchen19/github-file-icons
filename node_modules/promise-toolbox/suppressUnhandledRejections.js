"use strict";

const noop = require("./_noop");

module.exports = function suppressUnhandledRejections() {
  const native = this.suppressUnhandledRejections;

  if (typeof native === "function") {
    native.call(this);
  } else {
    this.then(undefined, noop);
  }

  return this;
};