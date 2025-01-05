'use strict';

var equal = require('fast-deep-equal');
var serialize = require('./utils').serialize;

function arrayEquals(before, after) {
  if (before.length !== after.length) {
    return false;
  }
  for (var i = 0; i < before.length; i++) {
    if (!equal(after[i], before[i])) {
      return false;
    }
  }
  return true;
}

module.exports = function generate(before, after) {
  before = serialize(before);
  after = serialize(after);

  if (before === null || after === null ||
    typeof before !== 'object' || typeof after !== 'object' ||
    Array.isArray(before) !== Array.isArray(after)) {
    return after;
  }

  if (Array.isArray(before)) {
    if (!arrayEquals(before, after)) {
      return after;
    }
    return undefined;
  }

  var patch = {};
  var beforeKeys = Object.keys(before);
  var afterKeys = Object.keys(after);

  var key, i;

  // new elements
  var newKeys = {};
  for (i = 0; i < afterKeys.length; i++) {
    key = afterKeys[i];
    if (beforeKeys.indexOf(key) === -1) {
      newKeys[key] = true;
      patch[key] = serialize(after[key]);
    }
  }

  // removed & modified elements
  var removedKeys = {};
  for (i = 0; i < beforeKeys.length; i++) {
    key = beforeKeys[i];
    if (afterKeys.indexOf(key) === -1) {
      removedKeys[key] = true;
      patch[key] = null;
    } else {
      if (before[key] !== null && typeof before[key] === 'object') {
        var subPatch = generate(before[key], after[key]);
        if (subPatch !== undefined) {
          patch[key] = subPatch;
        }
      } else if (before[key] !== after[key]) {
        patch[key] = serialize(after[key]);
      }
    }
  }

  return (Object.keys(patch).length > 0 ? patch : undefined);
};
