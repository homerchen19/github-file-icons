"use strict";

const defer = require("./defer");

const Cancel = require("./Cancel");

const isPromise = require("./isPromise");

const noop = require("./_noop");

const _require = require("./_symbols"),
      $$toStringTag = _require.$$toStringTag;

const cancelTokenTag = "CancelToken";

function cancel(message) {
  if (this._reason !== undefined) {
    return;
  }

  const reason = this._reason = message instanceof Cancel ? message : new Cancel(message);
  const resolve = this._resolve;

  if (resolve !== undefined) {
    this._resolve = undefined;
    resolve(reason);
  }

  const onabort = this.onabort;

  if (typeof onabort === "function") {
    onabort();
  }

  const handlers = this._handlers;

  if (handlers !== undefined) {
    this._handlers = undefined;

    const _defer = defer(),
          promise = _defer.promise,
          resolve = _defer.resolve;

    let wait = 0;

    const onSettle = () => {
      if (--wait === 0) {
        return resolve();
      }
    };

    for (let i = 0, n = handlers.length; i < n; ++i) {
      try {
        const result = handlers[i](reason);

        if (isPromise(result)) {
          ++wait;
          result.then(onSettle, onSettle);
        }
      } catch (_) {}
    }

    if (wait !== 0) {
      return promise;
    }
  }
}

function cancelFromSignal(signal) {
  cancel.call(this, signal.reason);
}

function removeHandler(handler) {
  const handlers = this._handlers;

  if (handlers !== undefined) {
    const i = handlers.indexOf(handler);

    if (i !== -1) {
      handlers.splice(i, 1);
    }
  }
}

const INTERNAL = {};

function CancelTokenSource(tokens) {
  const cancel_ = this.cancel = cancel.bind(this.token = new CancelToken(INTERNAL));

  if (tokens == null) {
    return;
  }

  tokens.forEach(token => {
    const reason = token.reason;

    if (reason !== undefined) {
      cancel_(reason);
      return false;
    }

    token.addHandler(cancel_);
  });
}

class CancelToken {
  static from(abortSignal) {
    if (CancelToken.isCancelToken(abortSignal)) {
      return abortSignal;
    }

    const token = new CancelToken(INTERNAL);
    abortSignal.addEventListener("abort", cancelFromSignal.bind(token, abortSignal));
    return token;
  }

  static isCancelToken(value) {
    return value != null && value[$$toStringTag] === cancelTokenTag;
  }

  static source(tokens) {
    return new CancelTokenSource(tokens);
  }

  constructor(executor) {
    this._handlers = undefined;
    this._promise = undefined;
    this._reason = undefined;
    this._resolve = undefined;
    this.onabort = undefined;

    if (executor !== INTERNAL) {
      executor(cancel.bind(this));
    }
  }

  get promise() {
    let promise = this._promise;

    if (promise === undefined) {
      const reason = this._reason;
      promise = this._promise = reason !== undefined ? Promise.resolve(reason) : new Promise(resolve => {
        this._resolve = resolve;
      });
    }

    return promise;
  }

  get reason() {
    return this._reason;
  }

  get requested() {
    return this._reason !== undefined;
  }

  addHandler(handler) {
    let handlers = this._handlers;

    if (handlers === undefined) {
      if (this.requested) {
        throw new TypeError("cannot add a handler to an already canceled token");
      }

      handlers = this._handlers = [];
    }

    handlers.push(handler);
    return removeHandler.bind(this, handler);
  }

  throwIfRequested() {
    const reason = this._reason;

    if (reason !== undefined) {
      throw reason;
    }
  }

  get [$$toStringTag]() {
    return cancelTokenTag;
  }

  get aborted() {
    return this.requested;
  }

  addEventListener(type, listener) {
    if (type !== "abort") {
      return;
    }

    const event = {
      type: "abort"
    };
    const handler = typeof listener === "function" ? () => listener(event) : () => listener.handleEvent(event);
    handler.listener = listener;
    this.addHandler(handler);
  }

  removeEventListener(type, listener) {
    if (type !== "abort") {
      return;
    }

    const handlers = this._handlers;

    if (handlers !== undefined) {
      const i = handlers.findIndex(handler => handler.listener === listener);

      if (i !== -1) {
        handlers.splice(i, 1);
      }
    }
  }

}

cancel.call(CancelToken.canceled = new CancelToken(INTERNAL));
CancelToken.none = new CancelToken(INTERNAL);

CancelToken.none.addHandler = function addHandler(handler) {
  return noop;
};

CancelToken.none._promise = {
  catch() {
    return this;
  },

  then() {
    return this;
  }

};
module.exports = CancelToken;