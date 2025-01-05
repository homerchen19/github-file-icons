"use strict";

const defer = () => {
  let resolve, reject;
  const promise = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  return {
    promise,
    reject,
    resolve
  };
};

module.exports = defer;