"use strict";

const pFinally = (p, cb) => p.then(cb, cb).then(() => p);

module.exports = pFinally;