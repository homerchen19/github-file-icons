"use strict";

if (typeof Promise !== "function" || typeof Promise.reject !== "function" || typeof Promise.resolve !== "function") {
  throw new Error("a standard Promise implementation is required (https://github.com/JsCommunity/promise-toolbox#usage)");
}

const isPromise = require("./isPromise");

const _require = require("./_symbols"),
      $$iterator = _require.$$iterator;

const forArray = exports.forArray = (array, iteratee) => {
  const length = array.length;

  for (let i = 0; i < length; ++i) {
    iteratee(array[i], i, array);
  }
};

exports.forIn = (object, iteratee) => {
  for (const key in object) {
    iteratee(object[key], key, object);
  }
};

const forIterable = exports.forIterable = (iterable, iteratee) => {
  const iterator = iterable[$$iterator]();
  let current;

  while (!(current = iterator.next()).done) {
    iteratee(current.value, undefined, iterable);
  }
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

const forOwn = exports.forOwn = (object, iteratee) => {
  for (const key in object) {
    if (hasOwnProperty.call(object, key)) {
      iteratee(object[key], key, object);
    }
  }
};

const isIterable = value => value != null && typeof value[$$iterator] === "function";

const forEach = exports.forEach = (collection, iteratee) => Array.isArray(collection) ? forArray(collection, iteratee) : isIterable(collection) ? forIterable(collection, iteratee) : isArrayLike(collection) ? forArray(collection, iteratee) : forOwn(collection, iteratee);

const isLength = value => typeof value === "number" && value >= 0 && value < Infinity && Math.floor(value) === value;

const isArrayLike = exports.isArrayLike = value => typeof value !== "function" && value != null && isLength(value.length);

exports.makeAsyncIterator = iterator => {
  const asyncIterator = (collection, iteratee) => {
    if (isPromise(collection)) {
      return collection.then(collection => asyncIterator(collection, iteratee));
    }

    let mainPromise = Promise.resolve();
    iterator(collection, (value, key) => {
      mainPromise = isPromise(value) ? mainPromise.then(() => value.then(value => iteratee(value, key, collection))) : mainPromise.then(() => iteratee(value, key, collection));
    });
    return mainPromise;
  };

  return asyncIterator;
};

exports.map = (collection, iteratee) => {
  const result = [];
  forEach(collection, (item, key, collection) => {
    result.push(iteratee(item, key, collection));
  });
  return result;
};

exports.mapAuto = (collection, iteratee) => {
  const result = isArrayLike(collection) ? new Array(collection.length) : Object.create(null);

  if (iteratee !== undefined) {
    forEach(collection, (item, key, collection) => {
      result[key] = iteratee(item, key, collection);
    });
  }

  return result;
};