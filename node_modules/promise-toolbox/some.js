"use strict";

const resolve = require("./_resolve");

const _require = require("./_utils"),
      forEach = _require.forEach;

const _some = (promises, count) => new Promise((resolve, reject) => {
  let values = [];
  let errors = [];

  const onFulfillment = value => {
    if (!values) {
      return;
    }

    values.push(value);

    if (--count === 0) {
      resolve(values);
      values = errors = undefined;
    }
  };

  let acceptableErrors = -count;

  const onRejection = reason => {
    if (!values) {
      return;
    }

    errors.push(reason);

    if (--acceptableErrors === 0) {
      reject(errors);
      values = errors = undefined;
    }
  };

  forEach(promises, promise => {
    ++acceptableErrors;
    resolve(promise).then(onFulfillment, onRejection);
  });
});

module.exports = function some(count) {
  return resolve(this).then(promises => _some(promises, count));
};