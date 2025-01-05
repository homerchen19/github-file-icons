"use strict";

const pTry = require("./try");

module.exports = v => typeof v === "function" ? pTry(v) : Promise.resolve(v);