"use strict";

const getSymbol = typeof Symbol === "function" ? name => {
  const symbol = Symbol[name];
  return symbol !== undefined ? symbol : `@@${name}`;
} : name => `@@${name}`;
exports.$$iterator = getSymbol("iterator");
exports.$$toStringTag = getSymbol("toStringTag");