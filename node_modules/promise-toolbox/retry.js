"use strict";

const matchError = require("./_matchError");

const noop = require("./_noop");

const setFunctionNameAndLength = require("./_setFunctionNameAndLength");

function retry(fn, {
  delay,
  delays,
  onRetry = noop,
  retries,
  tries,
  when
} = {}, args) {
  let shouldRetry;

  if (delays !== undefined) {
    if (delay !== undefined || tries !== undefined || retries !== undefined) {
      throw new TypeError("delays is incompatible with delay, tries and retries");
    }

    const iterator = delays[Symbol.iterator]();

    shouldRetry = () => {
      const _iterator$next = iterator.next(),
            done = _iterator$next.done,
            value = _iterator$next.value;

      if (done) {
        return false;
      }

      delay = value;
      return true;
    };
  } else {
    if (tries === undefined) {
      tries = retries !== undefined ? retries + 1 : 10;
    } else if (retries !== undefined) {
      throw new TypeError("retries and tries options are mutually exclusive");
    }

    if (delay === undefined) {
      delay = 1e3;
    }

    shouldRetry = () => --tries !== 0;
  }

  when = matchError.bind(undefined, when);
  let attemptNumber = 0;

  const sleepResolver = resolve => setTimeout(resolve, delay);

  const sleep = () => new Promise(sleepResolver);

  const onError = error => {
    if (error instanceof ErrorContainer) {
      throw error.error;
    }

    if (when(error) && shouldRetry()) {
      let promise = Promise.resolve(onRetry.call({
        arguments: args,
        attemptNumber: attemptNumber++,
        delay,
        fn,
        this: this
      }, error));

      if (delay !== 0) {
        promise = promise.then(sleep);
      }

      return promise.then(loop);
    }

    throw error;
  };

  const loopResolver = resolve => resolve(fn.apply(this, args));

  const loop = () => new Promise(loopResolver).catch(onError);

  return loop();
}

module.exports = retry;

function ErrorContainer(error) {
  this.error = error;
}

retry.bail = function retryBail(error) {
  throw new ErrorContainer(error);
};

retry.wrap = function retryWrap(fn, options) {
  const getOptions = typeof options !== "function" ? () => options : options;
  return setFunctionNameAndLength(function () {
    return retry.call(this, fn, getOptions.apply(this, arguments), Array.from(arguments));
  }, fn.name, fn.length);
};