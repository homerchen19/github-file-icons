"use strict";

const cancelable = require("./cancelable");

const makeEventAdder = require("./_makeEventAdder");

const _require = require("./_utils"),
      forArray = _require.forArray;

const fromEvents = cancelable(($cancelToken, emitter, successEvents, errorEvents = ["error"]) => new Promise((resolve, reject) => {
  const add = makeEventAdder($cancelToken, emitter, true);
  forArray(successEvents, event => add(event, resolve));
  forArray(errorEvents, event => add(event, reject));
}));
module.exports = fromEvents;