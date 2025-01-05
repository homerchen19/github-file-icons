"use strict";

module.exports = reason => reason instanceof ReferenceError || reason instanceof SyntaxError || reason instanceof TypeError;