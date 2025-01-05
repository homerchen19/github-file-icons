"use strict";

module.exports = (() => {
  const _defineProperties = Object.defineProperties;

  try {
    const f = _defineProperties(function () {}, {
      length: {
        value: 2
      },
      name: {
        value: "foo"
      }
    });

    if (f.length === 2 && f.name === "foo") {
      return (fn, name, length) => _defineProperties(fn, {
        length: {
          configurable: true,
          value: length > 0 ? length : 0
        },
        name: {
          configurable: true,
          value: name
        }
      });
    }
  } catch (_) {}

  return require("./_identity");
})();