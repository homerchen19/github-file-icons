"use strict";

const identity = require("./_identity");

const isPromise = require("./isPromise");

const toPromise = require("./_resolve");

const noop = Function.prototype;

function step(key, value) {
  let cursor;

  try {
    cursor = this._iterator[key](value);
  } catch (error) {
    this.finally();
    return this._reject(error);
  }

  value = cursor.value;

  if (cursor.done) {
    this.finally();

    this._resolve(value);
  } else {
    this.toPromise(value).then(this.next, this._throw);
  }
}

function AsyncFn(iterator, resolve, reject) {
  this._iterator = iterator;
  this._reject = reject;
  this._resolve = resolve;
  this._throw = step.bind(this, "throw");
  this.next = step.bind(this, "next");
}

AsyncFn.prototype.finally = noop;
AsyncFn.prototype.toPromise = toPromise;

const asyncFn = generator => function () {
  return new Promise((resolve, reject) => new AsyncFn(generator.apply(this, arguments), resolve, reject).next());
};

function CancelabledAsyncFn(cancelToken) {
  AsyncFn.apply(this, [].slice.call(arguments, 1));
  this._cancelToken = cancelToken;
  this._onCancel = noop;
  this.finally = cancelToken.addHandler(reason => {
    this._onCancel(reason);

    return new Promise(resolve => {
      this.finally = resolve;
    });
  });
}

Object.setPrototypeOf(CancelabledAsyncFn.prototype, Object.getPrototypeOf(AsyncFn.prototype)).toPromise = function (value) {
  if (Array.isArray(value)) {
    return toPromise(value[0]);
  }

  const cancelToken = this._cancelToken;

  if (cancelToken.requested) {
    return Promise.reject(cancelToken.reason);
  }

  return isPromise(value) ? new Promise((resolve, reject) => {
    value.then(resolve, reject);
    this._onCancel = reject;
  }) : Promise.resolve(value);
};

asyncFn.cancelable = (generator, getCancelToken = identity) => function () {
  const cancelToken = getCancelToken.apply(this, arguments);

  if (cancelToken.requested) {
    return Promise.reject(cancelToken.reason);
  }

  return new Promise((resolve, reject) => {
    new CancelabledAsyncFn(cancelToken, generator.apply(this, arguments), resolve, reject).next();
  });
};

module.exports = asyncFn;