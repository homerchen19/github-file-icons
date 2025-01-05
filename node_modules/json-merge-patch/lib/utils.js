'use strict';

module.exports.serialize = function(value) {
  return (value && typeof value.toJSON === 'function') ? value.toJSON() : value;
};
