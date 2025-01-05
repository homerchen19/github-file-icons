"use strict";

const isProgrammerError = require("./_isProgrammerError");

module.exports = function matchError(predicate, error) {
  if (predicate === undefined) {
    return !isProgrammerError(error);
  }

  const type = typeof predicate;

  if (type === "boolean") {
    return predicate;
  }

  if (type === "function") {
    return predicate === Error || predicate.prototype instanceof Error ? error instanceof predicate : predicate(error);
  }

  if (Array.isArray(predicate)) {
    const n = predicate.length;

    for (let i = 0; i < n; ++i) {
      if (matchError(predicate[i], error)) {
        return true;
      }
    }

    return false;
  }

  if (error != null && type === "object") {
    for (const key in predicate) {
      if (hasOwnProperty.call(predicate, key) && error[key] !== predicate[key]) {
        return false;
      }
    }

    return true;
  }
};