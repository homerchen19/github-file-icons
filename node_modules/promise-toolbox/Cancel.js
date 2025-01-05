"use strict";

module.exports = class Cancel {
  constructor(message = "this action has been canceled") {
    Object.defineProperty(this, "message", {
      enumerable: true,
      value: message
    });
  }

  toString() {
    return `Cancel: ${this.message}`;
  }

};