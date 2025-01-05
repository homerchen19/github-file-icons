"use strict";

const TimeoutError = require("./TimeoutError");

module.exports = function timeout(ms, onReject) {
  if (ms === 0) {
    return this;
  }

  if (onReject === undefined) {
    onReject = new TimeoutError();
  }

  return new Promise((resolve, reject) => {
    let handle = setTimeout(() => {
      handle = undefined;

      if (typeof this.cancel === "function") {
        this.cancel();
      }

      if (typeof onReject === "function") {
        try {
          resolve(onReject());
        } catch (error) {
          reject(error);
        }
      } else {
        reject(onReject);
      }
    }, ms);
    this.then(value => {
      handle !== undefined && clearTimeout(handle);
      resolve(value);
    }, reason => {
      handle !== undefined && clearTimeout(handle);
      reject(reason);
    });
  });
};