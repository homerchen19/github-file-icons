"use strict";

const isPromise = require("./isPromise");

module.exports = value => isPromise(value) ? value : Promise.resolve(value);