"use strict";

const FN_FALSE = () => false;

const FN_TRUE = () => true;

const onFulfilled = (__proto__ => _value => ({
  __proto__: __proto__,
  value: () => _value
}))({
  isFulfilled: FN_TRUE,
  isPending: FN_FALSE,
  isRejected: FN_FALSE,
  reason: () => {
    throw new Error("no reason, the promise has resolved");
  }
});

const onRejected = (__proto__ => _reason => ({
  __proto__: __proto__,
  reason: () => _reason
}))({
  isFulfilled: FN_FALSE,
  isPending: FN_FALSE,
  isRejected: FN_TRUE,
  value: () => {
    throw new Error("no value, the promise has rejected");
  }
});

module.exports = function () {
  return this.then(onFulfilled, onRejected);
};