const freeGlobalThis =
  typeof globalThis !== 'undefined' &&
  globalThis !== null &&
  globalThis.Object === Object &&
  globalThis;

const freeGlobal =
  typeof global !== 'undefined' &&
  global !== null &&
  global.Object === Object &&
  global;

const freeSelf =
  typeof self !== 'undefined' &&
  self !== null &&
  self.Object === Object &&
  self;

export const globalObject =
  freeGlobalThis || freeGlobal || freeSelf || Function('return this')();
