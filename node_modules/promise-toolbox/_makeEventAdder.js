"use strict";

const noop = require("./_noop");

const once = require("./_once");

module.exports = ($cancelToken, emitter, arrayArg) => {
  const add = emitter.addEventListener || emitter.addListener || emitter.on;

  if (add === undefined) {
    throw new Error("cannot register event listener");
  }

  const remove = emitter.removeEventListener || emitter.removeListener || emitter.off;
  const eventsAndListeners = [];
  let clean = noop;

  if (remove !== undefined) {
    clean = once(() => {
      for (let i = 0, n = eventsAndListeners.length; i < n; i += 2) {
        remove.call(emitter, eventsAndListeners[i], eventsAndListeners[i + 1]);
      }
    });
    $cancelToken.promise.then(clean);
  }

  return arrayArg ? (eventName, cb) => {
    function listener() {
      clean();
      const event = Array.prototype.slice.call(arguments);
      event.args = event;
      event.event = event.name = eventName;
      cb(event);
    }

    eventsAndListeners.push(eventName, listener);
    add.call(emitter, eventName, listener);
  } : (event, cb) => {
    const listener = arg => {
      clean();
      cb(arg);
    };

    eventsAndListeners.push(event, listener);
    add.call(emitter, event, listener);
  };
};