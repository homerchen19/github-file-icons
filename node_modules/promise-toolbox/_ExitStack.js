"use strict";

const isDisposable = require("./_isDisposable");

const resolve = require("./_resolve");

module.exports = class ExitStack {
  constructor() {
    this._disposables = [];

    const dispose = () => {
      const disposable = this._disposables.pop();

      return disposable !== undefined ? resolve(disposable.dispose()).then(dispose) : Promise.resolve();
    };

    return {
      dispose,
      value: this
    };
  }

  enter(disposable) {
    if (!isDisposable(disposable)) {
      throw new TypeError("not a disposable");
    }

    this._disposables.push(disposable);

    return disposable.value;
  }

};