"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalObject = void 0;
const freeGlobalThis = typeof globalThis !== 'undefined' && globalThis !== null && globalThis.Object === Object && globalThis;
const freeGlobal = typeof global !== 'undefined' && global !== null && global.Object === Object && global;
const freeSelf = typeof self !== 'undefined' && self !== null && self.Object === Object && self;
const globalObject = freeGlobalThis || freeGlobal || freeSelf || Function('return this')();
exports.globalObject = globalObject;
//# sourceMappingURL=global.js.map