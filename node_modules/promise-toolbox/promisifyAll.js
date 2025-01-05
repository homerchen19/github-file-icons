"use strict";

const promisify = require("./promisify");

const _require = require("./_utils"),
      forIn = _require.forIn;

const DEFAULT_MAPPER = (_, name) => !(name.endsWith("Sync") || name.endsWith("Async")) && name;

const promisifyAll = (obj, {
  mapper = DEFAULT_MAPPER,
  target = {},
  context = obj
} = {}) => {
  forIn(obj, (value, name) => {
    let newName;

    if (typeof value === "function" && (newName = mapper(value, name, obj))) {
      target[newName] = promisify(value, context);
    }
  });
  return target;
};

module.exports = promisifyAll;