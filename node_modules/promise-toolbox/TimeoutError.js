"use strict";

const _require = require("make-error"),
      BaseError = _require.BaseError;

module.exports = class TimeoutError extends BaseError {
  constructor() {
    super("operation timed out");
  }

};