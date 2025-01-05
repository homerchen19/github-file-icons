"use strict";

const noop = require("./_noop");

const _require = require("./_utils"),
      makeAsyncIterator = _require.makeAsyncIterator;

const makeAsyncIteratorWrapper = iterator => {
  const asyncIterator = makeAsyncIterator(iterator);
  return function asyncIteratorWrapper(iteratee) {
    return asyncIterator(this, iteratee).then(noop);
  };
};

module.exports = makeAsyncIteratorWrapper;