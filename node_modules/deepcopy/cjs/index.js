"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deepcopy;

var _detector = require("./detector.js");

var _collection = require("./collection.js");

var _copier = require("./copier.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

/**
 * deepcopy function
 *
 * @param {*} value
 * @param {Object|Function} [options]
 * @return {*}
 */
function deepcopy(value, options = {}) {
  if (typeof options === 'function') {
    options = {
      customizer: options
    };
  }

  const _options = options,
        customizer = _options.customizer;
  const valueType = (0, _detector.detectType)(value);

  if (!(0, _collection.isCollection)(valueType)) {
    return recursiveCopy(value, null, null, null, customizer);
  }

  const copiedValue = (0, _copier.copy)(value, valueType, customizer);
  const references = new WeakMap([[value, copiedValue]]);
  const visited = new WeakSet([value]);
  return recursiveCopy(value, copiedValue, references, visited, customizer);
}
/**
 * recursively copy
 *
 * @param {*} value target value
 * @param {*} clone clone of value
 * @param {WeakMap} references visited references of clone
 * @param {WeakSet} visited visited references of value
 * @param {Function} customizer user customize function
 * @return {*}
 */


function recursiveCopy(value, clone, references, visited, customizer) {
  const type = (0, _detector.detectType)(value);
  const copiedValue = (0, _copier.copy)(value, type); // return if not a collection value

  if (!(0, _collection.isCollection)(type)) {
    return copiedValue;
  }

  let keys;

  switch (type) {
    case 'Arguments':
    case 'Array':
      keys = Object.keys(value);
      break;

    case 'Object':
      keys = Object.keys(value);
      keys.push(...Object.getOwnPropertySymbols(value));
      break;

    case 'Map':
    case 'Set':
      keys = value.keys();
      break;

    default:
  } // walk within collection with iterator


  var _iterator = _createForOfIteratorHelper(keys),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      let collectionKey = _step.value;
      const collectionValue = (0, _collection.get)(value, collectionKey, type);

      if (visited.has(collectionValue)) {
        // for [Circular]
        (0, _collection.set)(clone, collectionKey, references.get(collectionValue), type);
      } else {
        const collectionValueType = (0, _detector.detectType)(collectionValue);
        const copiedCollectionValue = (0, _copier.copy)(collectionValue, collectionValueType); // save reference if value is collection

        if ((0, _collection.isCollection)(collectionValueType)) {
          references.set(collectionValue, copiedCollectionValue);
          visited.add(collectionValue);
        }

        (0, _collection.set)(clone, collectionKey, recursiveCopy(collectionValue, copiedCollectionValue, references, visited, customizer), type);
      }
    } // TODO: isSealed/isFrozen/isExtensible

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return clone;
}
//# sourceMappingURL=index.js.map