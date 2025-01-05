'use strict';

module.exports = function merge(patch1, patch2) {
  if (patch1 === null || patch2 === null ||
    typeof patch1 !== 'object' || typeof patch2 !== 'object' ||
    Array.isArray(patch1) !== Array.isArray(patch2)) {
    return patch2;
  }
  var patch = JSON.parse(JSON.stringify(patch1));

  Object.keys(patch2)
    .forEach(function(key) {
      if (patch1[key] !== undefined) {
        patch[key] = merge(patch1[key], patch2[key]);
      } else {
        patch[key] = patch2[key];
      }
    });
  return patch;
};
