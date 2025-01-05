"use strict";

const cancelable = require("./cancelable");

const makeEventAdder = require("./_makeEventAdder");

const fromEvent = cancelable(($cancelToken, emitter, event, opts = {}) => new Promise((resolve, reject) => {
  const add = makeEventAdder($cancelToken, emitter, opts.array);
  add(event, resolve);

  if (!opts.ignoreErrors) {
    const _opts$error = opts.error,
          error = _opts$error === void 0 ? "error" : _opts$error;

    if (error !== event) {
      add(error, reject);
    }
  }
}));
module.exports = fromEvent;