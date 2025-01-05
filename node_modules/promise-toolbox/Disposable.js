"use strict";

const evalDisposable = require("./_evalDisposable");

const isDisposable = require("./_isDisposable");

const pFinally = require("./_finally");

const setFunctionNameAndLength = require("./_setFunctionNameAndLength");

const wrapApply = require("./wrapApply");

const wrapCall = require("./wrapCall");

class Disposable {
  constructor(dispose, value) {
    if (typeof dispose !== "function") {
      throw new Error("dispose must be a function");
    }

    this._dispose = dispose;
    this._value = value;
  }

  get value() {
    if (this._dispose === undefined) {
      throw new TypeError("cannot get value of already disposed disposable");
    }

    return this._value;
  }

  dispose() {
    if (this._dispose === undefined) {
      throw new TypeError("cannot dispose already disposed disposable");
    }

    const d = this._dispose;
    this._dispose = this._value = undefined;
    return d();
  }

}

module.exports = Disposable;

Disposable.all = function all(iterable) {
  let disposables = [];

  const dispose = () => {
    const d = disposables;
    disposables = undefined;
    d.forEach(disposable => disposable.dispose());
  };

  const onFulfill = maybeDisposable => {
    if (disposables === undefined) {
      return isDisposable(maybeDisposable) && maybeDisposable.dispose();
    }

    if (isDisposable(maybeDisposable)) {
      disposables.push(maybeDisposable);
      return maybeDisposable.value;
    }

    return maybeDisposable;
  };

  const onReject = error => {
    if (disposables === undefined) {
      return;
    }

    dispose();
    throw error;
  };

  return Promise.all(Array.from(iterable, maybeDisposable => evalDisposable(maybeDisposable).then(onFulfill, onReject))).then(values => new Disposable(dispose, values));
};

const ExitStack = require("./_ExitStack");

Disposable.factory = genFn => setFunctionNameAndLength(function () {
  const gen = genFn.apply(this, arguments);

  const _ExitStack = new ExitStack(),
        dispose = _ExitStack.dispose,
        stack = _ExitStack.value;

  const onEvalDisposable = value => isDisposable(value) ? loop(stack.enter(value)) : value;

  const onFulfill = ({
    value
  }) => evalDisposable(value).then(onEvalDisposable);

  const loop = value => wrapCall(gen.next, value, gen).then(onFulfill);

  return loop().then(value => new Disposable(() => wrapCall(gen.return, undefined, gen).then(dispose), value), error => {
    const forwardError = () => {
      throw error;
    };

    return dispose().then(forwardError, forwardError);
  });
}, genFn.name, genFn.length);

const onHandlerFulfill = result => {
  const _ExitStack2 = new ExitStack(),
        dispose = _ExitStack2.dispose,
        stack = _ExitStack2.value;

  const onEvalDisposable = disposable => loop(stack.enter(disposable));

  const onFulfill = cursor => cursor.done ? cursor.value : evalDisposable(cursor.value).then(onEvalDisposable);

  const loop = value => wrapCall(result.next, value, result).then(onFulfill);

  return pFinally(loop(), dispose);
};

Disposable.use = function use() {
  let nDisposables = arguments.length - 1;

  if (nDisposables < 0) {
    throw new TypeError("Disposable.use expects at least 1 argument");
  }

  const handler = arguments[nDisposables];

  if (nDisposables === 0) {
    return new Promise(resolve => resolve(handler.call(this))).then(onHandlerFulfill);
  }

  let disposables;
  const spread = !Array.isArray(disposables = arguments[0]);

  if (spread) {
    disposables = Array.prototype.slice.call(arguments, 0, nDisposables);
  } else {
    nDisposables = disposables.length;
  }

  return Disposable.all(disposables).then(dAll => pFinally((spread ? wrapApply : wrapCall)(handler, dAll.value, this), () => dAll.dispose()));
};

Disposable.wrap = function wrap(generator) {
  return setFunctionNameAndLength(function () {
    return Disposable.use(() => generator.apply(this, arguments));
  }, generator.name, generator.length);
};