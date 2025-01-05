'use strict';

var serialize = require('./utils').serialize;

module.exports = function apply(target, patch) {
  patch = serialize(patch);
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
    return patch;
  }

  target = serialize(target);
  if (target === null || typeof target !== 'object' || Array.isArray(target)) {
    target = {};
  }
  var keys = Object.keys(patch);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return target;
    }
    if (patch[key] === null) {
      if (target.hasOwnProperty(key)) {
        delete target[key];
      }
    } else {
      target[key] = apply(target[key], patch[key]);
    }
  }
  return target;
};
