"use strict";

exports.hideLiteralErrorFromLinter = literal => literal;

exports.reject = reason => Promise.reject(reason);

exports.throwArg = value => {
  throw value;
};