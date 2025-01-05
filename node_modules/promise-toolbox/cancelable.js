"use strict";

const setFunctionNameAndLength = require("./_setFunctionNameAndLength");

const _require = require("./CancelToken"),
      isCancelToken = _require.isCancelToken,
      source = _require.source;

const cancelable = (target, name, descriptor) => {
  const fn = descriptor !== undefined ? descriptor.value : target;
  const wrapper = setFunctionNameAndLength(function cancelableWrapper() {
    const length = arguments.length;

    if (length !== 0 && isCancelToken(arguments[0])) {
      return fn.apply(this, arguments);
    }

    const _source = source(),
          cancel = _source.cancel,
          token = _source.token;

    const args = new Array(length + 1);
    args[0] = token;

    for (let i = 0; i < length; ++i) {
      args[i + 1] = arguments[i];
    }

    const promise = fn.apply(this, args);
    promise.cancel = cancel;
    return promise;
  }, fn.name, fn.length - 1);

  if (descriptor !== undefined) {
    descriptor.value = wrapper;
    return descriptor;
  }

  return wrapper;
};

module.exports = cancelable;