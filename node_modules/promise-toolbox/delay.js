"use strict";

const isPromise = require("./isPromise");

module.exports = function delay(ms) {
  const value = arguments.length === 2 ? arguments[1] : this;

  if (isPromise(value)) {
    return value.then(value => new Promise(resolve => {
      setTimeout(resolve, ms, value);
    }));
  }

  let handle;
  const p = new Promise(resolve => {
    handle = setTimeout(resolve, ms, value);
  });

  p.unref = () => {
    if (handle != null && typeof handle.unref === "function") {
      handle.unref();
    }

    return p;
  };

  return p;
};