"use strict";

module.exports = fn => {
  let result;
  return function () {
    if (fn !== undefined) {
      result = fn.apply(this, arguments);
      fn = undefined;
    }

    return result;
  };
};