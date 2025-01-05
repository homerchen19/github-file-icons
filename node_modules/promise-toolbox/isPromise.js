"use strict";

const isPromise = value => value != null && typeof value.then === "function";

module.exports = isPromise;