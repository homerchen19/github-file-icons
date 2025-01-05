/*!
 * @license deepcopy.js Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/deepcopy.js
 * Released under the MIT license.
 *
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.deepcopy = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var typeDetect = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		 module.exports = factory() ;
	}(commonjsGlobal, (function () {
	/* !
	 * type-detect
	 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */
	var promiseExists = typeof Promise === 'function';

	/* eslint-disable no-undef */
	var globalObject = typeof self === 'object' ? self : commonjsGlobal; // eslint-disable-line id-blacklist

	var symbolExists = typeof Symbol !== 'undefined';
	var mapExists = typeof Map !== 'undefined';
	var setExists = typeof Set !== 'undefined';
	var weakMapExists = typeof WeakMap !== 'undefined';
	var weakSetExists = typeof WeakSet !== 'undefined';
	var dataViewExists = typeof DataView !== 'undefined';
	var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
	var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
	var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
	var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
	var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
	var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
	var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
	var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
	var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
	var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
	var toStringLeftSliceLength = 8;
	var toStringRightSliceLength = -1;
	/**
	 * ### typeOf (obj)
	 *
	 * Uses `Object.prototype.toString` to determine the type of an object,
	 * normalising behaviour across engine versions & well optimised.
	 *
	 * @param {Mixed} object
	 * @return {String} object type
	 * @api public
	 */
	function typeDetect(obj) {
	  /* ! Speed optimisation
	   * Pre:
	   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
	   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
	   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
	   *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
	   *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
	   * Post:
	   *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
	   *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
	   *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
	   *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
	   *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
	   */
	  var typeofObj = typeof obj;
	  if (typeofObj !== 'object') {
	    return typeofObj;
	  }

	  /* ! Speed optimisation
	   * Pre:
	   *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
	   * Post:
	   *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
	   */
	  if (obj === null) {
	    return 'null';
	  }

	  /* ! Spec Conformance
	   * Test: `Object.prototype.toString.call(window)``
	   *  - Node === "[object global]"
	   *  - Chrome === "[object global]"
	   *  - Firefox === "[object Window]"
	   *  - PhantomJS === "[object Window]"
	   *  - Safari === "[object Window]"
	   *  - IE 11 === "[object Window]"
	   *  - IE Edge === "[object Window]"
	   * Test: `Object.prototype.toString.call(this)``
	   *  - Chrome Worker === "[object global]"
	   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
	   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
	   *  - IE 11 Worker === "[object WorkerGlobalScope]"
	   *  - IE Edge Worker === "[object WorkerGlobalScope]"
	   */
	  if (obj === globalObject) {
	    return 'global';
	  }

	  /* ! Speed optimisation
	   * Pre:
	   *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
	   * Post:
	   *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
	   */
	  if (
	    Array.isArray(obj) &&
	    (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))
	  ) {
	    return 'Array';
	  }

	  // Not caching existence of `window` and related properties due to potential
	  // for `window` to be unset before tests in quasi-browser environments.
	  if (typeof window === 'object' && window !== null) {
	    /* ! Spec Conformance
	     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
	     * WhatWG HTML$7.7.3 - The `Location` interface
	     * Test: `Object.prototype.toString.call(window.location)``
	     *  - IE <=11 === "[object Object]"
	     *  - IE Edge <=13 === "[object Object]"
	     */
	    if (typeof window.location === 'object' && obj === window.location) {
	      return 'Location';
	    }

	    /* ! Spec Conformance
	     * (https://html.spec.whatwg.org/#document)
	     * WhatWG HTML$3.1.1 - The `Document` object
	     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
	     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
	     *       which suggests that browsers should use HTMLTableCellElement for
	     *       both TD and TH elements. WhatWG separates these.
	     *       WhatWG HTML states:
	     *         > For historical reasons, Window objects must also have a
	     *         > writable, configurable, non-enumerable property named
	     *         > HTMLDocument whose value is the Document interface object.
	     * Test: `Object.prototype.toString.call(document)``
	     *  - Chrome === "[object HTMLDocument]"
	     *  - Firefox === "[object HTMLDocument]"
	     *  - Safari === "[object HTMLDocument]"
	     *  - IE <=10 === "[object Document]"
	     *  - IE 11 === "[object HTMLDocument]"
	     *  - IE Edge <=13 === "[object HTMLDocument]"
	     */
	    if (typeof window.document === 'object' && obj === window.document) {
	      return 'Document';
	    }

	    if (typeof window.navigator === 'object') {
	      /* ! Spec Conformance
	       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
	       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
	       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
	       *  - IE <=10 === "[object MSMimeTypesCollection]"
	       */
	      if (typeof window.navigator.mimeTypes === 'object' &&
	          obj === window.navigator.mimeTypes) {
	        return 'MimeTypeArray';
	      }

	      /* ! Spec Conformance
	       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
	       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
	       * Test: `Object.prototype.toString.call(navigator.plugins)``
	       *  - IE <=10 === "[object MSPluginsCollection]"
	       */
	      if (typeof window.navigator.plugins === 'object' &&
	          obj === window.navigator.plugins) {
	        return 'PluginArray';
	      }
	    }

	    if ((typeof window.HTMLElement === 'function' ||
	        typeof window.HTMLElement === 'object') &&
	        obj instanceof window.HTMLElement) {
	      /* ! Spec Conformance
	      * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
	      * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
	      * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
	      *  - IE <=10 === "[object HTMLBlockElement]"
	      */
	      if (obj.tagName === 'BLOCKQUOTE') {
	        return 'HTMLQuoteElement';
	      }

	      /* ! Spec Conformance
	       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
	       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
	       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
	       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
	       *       which suggests that browsers should use HTMLTableCellElement for
	       *       both TD and TH elements. WhatWG separates these.
	       * Test: Object.prototype.toString.call(document.createElement('td'))
	       *  - Chrome === "[object HTMLTableCellElement]"
	       *  - Firefox === "[object HTMLTableCellElement]"
	       *  - Safari === "[object HTMLTableCellElement]"
	       */
	      if (obj.tagName === 'TD') {
	        return 'HTMLTableDataCellElement';
	      }

	      /* ! Spec Conformance
	       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
	       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
	       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
	       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
	       *       which suggests that browsers should use HTMLTableCellElement for
	       *       both TD and TH elements. WhatWG separates these.
	       * Test: Object.prototype.toString.call(document.createElement('th'))
	       *  - Chrome === "[object HTMLTableCellElement]"
	       *  - Firefox === "[object HTMLTableCellElement]"
	       *  - Safari === "[object HTMLTableCellElement]"
	       */
	      if (obj.tagName === 'TH') {
	        return 'HTMLTableHeaderCellElement';
	      }
	    }
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
	  *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
	  *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
	  *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
	  *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
	  *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
	  *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
	  *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
	  *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
	  * Post:
	  *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
	  *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
	  *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
	  *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
	  *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
	  *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
	  *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
	  *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
	  *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
	  */
	  var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
	  if (typeof stringTag === 'string') {
	    return stringTag;
	  }

	  var objPrototype = Object.getPrototypeOf(obj);
	  /* ! Speed optimisation
	  * Pre:
	  *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
	  *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
	  * Post:
	  *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
	  *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
	  */
	  if (objPrototype === RegExp.prototype) {
	    return 'RegExp';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
	  * Post:
	  *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
	  */
	  if (objPrototype === Date.prototype) {
	    return 'Date';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
	   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
	   * Test: `Object.prototype.toString.call(Promise.resolve())``
	   *  - Chrome <=47 === "[object Object]"
	   *  - Edge <=20 === "[object Object]"
	   *  - Firefox 29-Latest === "[object Promise]"
	   *  - Safari 7.1-Latest === "[object Promise]"
	   */
	  if (promiseExists && objPrototype === Promise.prototype) {
	    return 'Promise';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
	  * Post:
	  *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
	  */
	  if (setExists && objPrototype === Set.prototype) {
	    return 'Set';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
	  * Post:
	  *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
	  */
	  if (mapExists && objPrototype === Map.prototype) {
	    return 'Map';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
	  * Post:
	  *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
	  */
	  if (weakSetExists && objPrototype === WeakSet.prototype) {
	    return 'WeakSet';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
	  * Post:
	  *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
	  */
	  if (weakMapExists && objPrototype === WeakMap.prototype) {
	    return 'WeakMap';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
	   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
	   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (dataViewExists && objPrototype === DataView.prototype) {
	    return 'DataView';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
	   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
	   * Test: `Object.prototype.toString.call(new Map().entries())``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (mapExists && objPrototype === mapIteratorPrototype) {
	    return 'Map Iterator';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
	   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
	   * Test: `Object.prototype.toString.call(new Set().entries())``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (setExists && objPrototype === setIteratorPrototype) {
	    return 'Set Iterator';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
	   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
	   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
	    return 'Array Iterator';
	  }

	  /* ! Spec Conformance
	   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
	   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
	   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
	   *  - Edge <=13 === "[object Object]"
	   */
	  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
	    return 'String Iterator';
	  }

	  /* ! Speed optimisation
	  * Pre:
	  *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
	  * Post:
	  *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
	  */
	  if (objPrototype === null) {
	    return 'Object';
	  }

	  return Object
	    .prototype
	    .toString
	    .call(obj)
	    .slice(toStringLeftSliceLength, toStringRightSliceLength);
	}

	return typeDetect;

	})));
	});

	const isBufferExists = typeof Buffer !== 'undefined';
	const isBufferFromExists = isBufferExists && typeof Buffer.from !== 'undefined';

	const isBuffer = isBufferExists
	  ? /**
	     * is value is Buffer?
	     *
	     * @param {*} value
	     * @return {boolean}
	     */
	    function isBuffer(value) {
	      return Buffer.isBuffer(value);
	    }
	  : /**
	     * return false
	     *
	     * NOTE: for Buffer unsupported
	     *
	     * @return {boolean}
	     */
	    function isBuffer() {
	      return false;
	    };

	const copy = isBufferFromExists
	  ? /**
	     * copy Buffer
	     *
	     * @param {Buffer} value
	     * @return {Buffer}
	     */
	    function copy(value) {
	      return Buffer.from(value);
	    }
	  : isBufferExists
	  ? /**
	     * copy Buffer
	     *
	     * NOTE: for old node.js
	     *
	     * @param {Buffer} value
	     * @return {Buffer}
	     */
	    function copy(value) {
	      return new Buffer(value);
	    }
	  : /**
	     * shallow copy
	     *
	     * NOTE: for Buffer unsupported
	     *
	     * @param {*}
	     * @return {*}
	     */
	    function copy(value) {
	      return value;
	    };

	/**
	 * detect type of value
	 *
	 * @param {*} value
	 * @return {string}
	 */
	function detectType(value) {
	  // NOTE: isBuffer must execute before type-detect,
	  // because type-detect returns 'Uint8Array'.
	  if (isBuffer(value)) {
	    return 'Buffer';
	  }

	  return typeDetect(value);
	}

	/**
	 * collection types
	 */
	const collectionTypeSet = new Set([
	  'Arguments',
	  'Array',
	  'Map',
	  'Object',
	  'Set'
	]);

	/**
	 * get value from collection
	 *
	 * @param {Array|Object|Map|Set} collection
	 * @param {string|number|symbol} key
	 * @param {string} [type=null]
	 * @return {*}
	 */
	function get(collection, key, type = null) {
	  const valueType = type || detectType(collection);

	  switch (valueType) {
	    case 'Arguments':
	    case 'Array':
	    case 'Object':
	      return collection[key];
	    case 'Map':
	      return collection.get(key);
	    case 'Set':
	      // NOTE: Set.prototype.keys is alias of Set.prototype.values
	      // it means key is equals value
	      return key;
	  }
	}

	/**
	 * check to type string is collection
	 *
	 * @param {string} type
	 */
	function isCollection(type) {
	  return collectionTypeSet.has(type);
	}

	/**
	 * set value to collection
	 *
	 * @param {Array|Object|Map|Set} collection
	 * @param {string|number|symbol} key
	 * @param {*} value
	 * @param {string} [type=null]
	 * @return {Array|Object|Map|Set}
	 */
	function set(collection, key, value, type = null) {
	  const valueType = type || detectType(collection);

	  switch (valueType) {
	    case 'Arguments':
	    case 'Array':
	    case 'Object':
	      collection[key] = value;
	      break;
	    case 'Map':
	      collection.set(key, value);
	      break;
	    case 'Set':
	      collection.add(value);
	      break;
	  }

	  return collection;
	}

	const freeGlobalThis =
	  typeof globalThis !== 'undefined' &&
	  globalThis !== null &&
	  globalThis.Object === Object &&
	  globalThis;

	const freeGlobal =
	  typeof global !== 'undefined' &&
	  global !== null &&
	  global.Object === Object &&
	  global;

	const freeSelf =
	  typeof self !== 'undefined' &&
	  self !== null &&
	  self.Object === Object &&
	  self;

	const globalObject =
	  freeGlobalThis || freeGlobal || freeSelf || Function('return this')();

	/**
	 * copy ArrayBuffer
	 *
	 * @param {ArrayBuffer} value
	 * @return {ArrayBuffer}
	 */
	function copyArrayBuffer(value) {
	  return value.slice(0);
	}

	/**
	 * copy Boolean
	 *
	 * @param {Boolean} value
	 * @return {Boolean}
	 */
	function copyBoolean(value) {
	  return new Boolean(value.valueOf());
	}

	/**
	 * copy DataView
	 *
	 * @param {DataView} value
	 * @return {DataView}
	 */
	function copyDataView(value) {
	  // TODO: copy ArrayBuffer?
	  return new DataView(value.buffer);
	}

	/**
	 * copy Buffer
	 *
	 * @param {Buffer} value
	 * @return {Buffer}
	 */
	function copyBuffer(value) {
	  return copy(value);
	}

	/**
	 * copy Date
	 *
	 * @param {Date} value
	 * @return {Date}
	 */
	function copyDate(value) {
	  return new Date(value.getTime());
	}

	/**
	 * copy Number
	 *
	 * @param {Number} value
	 * @return {Number}
	 */
	function copyNumber(value) {
	  return new Number(value);
	}

	/**
	 * copy RegExp
	 *
	 * @param {RegExp} value
	 * @return {RegExp}
	 */
	function copyRegExp(value) {
	  return new RegExp(value.source, value.flags);
	}

	/**
	 * copy String
	 *
	 * @param {String} value
	 * @return {String}
	 */
	function copyString(value) {
	  return new String(value);
	}

	/**
	 * copy TypedArray
	 *
	 * @param {*} value
	 * @return {*}
	 */
	function copyTypedArray(value, type) {
	  const typedArray = globalObject[type];

	  if (typedArray.from) {
	    return globalObject[type].from(value);
	  }

	  return new globalObject[type](value);
	}

	/**
	 * shallow copy
	 *
	 * @param {*} value
	 * @return {*}
	 */
	function shallowCopy(value) {
	  return value;
	}

	/**
	 * get empty Array
	 *
	 * @return {Array}
	 */
	function getEmptyArray() {
	  return [];
	}

	/**
	 * get empty Map
	 *
	 * @return {Map}
	 */
	function getEmptyMap() {
	  return new Map();
	}

	/**
	 * get empty Object
	 *
	 * @return {Object}
	 */
	function getEmptyObject() {
	  return {};
	}

	/**
	 * get empty Set
	 *
	 * @return {Set}
	 */
	function getEmptySet() {
	  return new Set();
	}

	var copyMap = new Map([
	  // deep copy
	  ['ArrayBuffer', copyArrayBuffer],
	  ['Boolean', copyBoolean],
	  ['Buffer', copyBuffer],
	  ['DataView', copyDataView],
	  ['Date', copyDate],
	  ['Number', copyNumber],
	  ['RegExp', copyRegExp],
	  ['String', copyString],

	  // typed arrays
	  // TODO: pass bound function
	  ['Float32Array', copyTypedArray],
	  ['Float64Array', copyTypedArray],
	  ['Int16Array', copyTypedArray],
	  ['Int32Array', copyTypedArray],
	  ['Int8Array', copyTypedArray],
	  ['Uint16Array', copyTypedArray],
	  ['Uint32Array', copyTypedArray],
	  ['Uint8Array', copyTypedArray],
	  ['Uint8ClampedArray', copyTypedArray],

	  // shallow copy
	  ['Array Iterator', shallowCopy],
	  ['Map Iterator', shallowCopy],
	  ['Promise', shallowCopy],
	  ['Set Iterator', shallowCopy],
	  ['String Iterator', shallowCopy],
	  ['function', shallowCopy],
	  ['global', shallowCopy],
	  // NOTE: WeakMap and WeakSet cannot get entries
	  ['WeakMap', shallowCopy],
	  ['WeakSet', shallowCopy],

	  // primitives
	  ['boolean', shallowCopy],
	  ['null', shallowCopy],
	  ['number', shallowCopy],
	  ['string', shallowCopy],
	  ['symbol', shallowCopy],
	  ['undefined', shallowCopy],

	  // collections
	  // NOTE: return empty value, because recursively copy later.
	  ['Arguments', getEmptyArray],
	  ['Array', getEmptyArray],
	  ['Map', getEmptyMap],
	  ['Object', getEmptyObject],
	  ['Set', getEmptySet]

	  // NOTE: type-detect returns following types
	  // 'Location'
	  // 'Document'
	  // 'MimeTypeArray'
	  // 'PluginArray'
	  // 'HTMLQuoteElement'
	  // 'HTMLTableDataCellElement'
	  // 'HTMLTableHeaderCellElement'

	  // TODO: is type-detect never return 'object'?
	  // 'object'
	]);

	/**
	 * no operation
	 */
	function noop() {}

	/**
	 * copy value
	 *
	 * @param {*} value
	 * @param {string} [type=null]
	 * @param {Function} [customizer=noop]
	 * @return {*}
	 */
	function copy$1(value, type = null, customizer = noop) {
	  if (arguments.length === 2 && typeof type === 'function') {
	    customizer = type;
	    type = null;
	  }

	  const valueType = type || detectType(value);
	  const copyFunction = copyMap.get(valueType);

	  if (valueType === 'Object') {
	    const result = customizer(value, valueType);

	    if (result !== undefined) {
	      return result;
	    }
	  }

	  // NOTE: TypedArray needs pass type to argument
	  return copyFunction ? copyFunction(value, valueType) : value;
	}

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

	  const {
	    // TODO: before/after customizer
	    customizer
	    // TODO: max depth
	    // depth = Infinity,
	  } = options;

	  const valueType = detectType(value);

	  if (!isCollection(valueType)) {
	    return recursiveCopy(value, null, null, null);
	  }

	  const copiedValue = copy$1(value, valueType, customizer);

	  const references = new WeakMap([[value, copiedValue]]);
	  const visited = new WeakSet([value]);

	  return recursiveCopy(value, copiedValue, references, visited);
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
	  const type = detectType(value);
	  const copiedValue = copy$1(value, type);

	  // return if not a collection value
	  if (!isCollection(type)) {
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
	  }

	  // walk within collection with iterator
	  for (let collectionKey of keys) {
	    const collectionValue = get(value, collectionKey, type);

	    if (visited.has(collectionValue)) {
	      // for [Circular]
	      set(clone, collectionKey, references.get(collectionValue), type);
	    } else {
	      const collectionValueType = detectType(collectionValue);
	      const copiedCollectionValue = copy$1(collectionValue, collectionValueType);

	      // save reference if value is collection
	      if (isCollection(collectionValueType)) {
	        references.set(collectionValue, copiedCollectionValue);
	        visited.add(collectionValue);
	      }

	      set(
	        clone,
	        collectionKey,
	        recursiveCopy(
	          collectionValue,
	          copiedCollectionValue,
	          references,
	          visited),
	        type
	      );
	    }
	  }

	  // TODO: isSealed/isFrozen/isExtensible

	  return clone;
	}

	return deepcopy;

})));
//# sourceMappingURL=deepcopy.js.map
