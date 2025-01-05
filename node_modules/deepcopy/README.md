# deepcopy.js

[![test](https://github.com/sasaplus1/deepcopy.js/workflows/test/badge.svg)](https://github.com/sasaplus1/deepcopy.js/actions?query=workflow%3Atest)
[![npm version](https://badge.fury.io/js/deepcopy.svg)](http://badge.fury.io/js/deepcopy)
[![Try deepcopy on RunKit](https://badge.runkitcdn.com/deepcopy.svg)](https://npm.runkit.com/deepcopy)
[![renovate](https://badges.renovateapi.com/github/sasaplus1/deepcopy.js)](https://renovatebot.com)

deep copy data

## Installation

### npm

```console
$ npm install deepcopy
```

## Usage

### node.js

#### JavaScript

```js
const deepcopy = require('deepcopy');
```

#### TypeScript
```typescript
import * as deepcopy from 'deepcopy';
```

### browser

```html
<script src="deepcopy.min.js"></script>
```

### Example

basic usage:

```js
const src = {
  desserts: [
    { name: 'cake'      },
    { name: 'ice cream' },
    { name: 'pudding'   }
  ]
};

const dist = deepcopy(src);

src.desserts = null;

console.log(src);   // { desserts: null }
console.log(dist);  // { desserts: [ { name: 'cake' }, { name: 'ice cream' }, { name: 'pudding' } ] }
```

customize deepcopy:

```js
function MyClass(id) {
  this._id = id;
}

const src = {
  myClasses: [
    new MyClass(1),
    new MyClass(2),
    new MyClass(3)
  ]
};

const dest = deepcopy(base, {
  customizer(value) {
    if (target.constructor === MyClass) {
      return new MyClass(target._id);
    }
  }
});

src.myClasses = null;

console.log(src);   // { myClasses: null }
console.log(dest);  // { myClasses: [ MyClass { _id: 1 }, MyClass { _id: 2 }, MyClass { _id: 3 } ] }
```

## Functions

### deepcopy(value[, options])

- `value`
  - `*`
    - target value
- `options`
  - `Object|Function`
    - `Object` - pass options
    - `Function` - use as customize function
- `return`
  - `*` - copied value

### Supported types and copy operation

|type              |operation   |                          |
|:-----------------|:-----------|:-------------------------|
|ArrayBuffer       |deep copy   |                          |
|Boolean           |deep copy   |                          |
|Buffer            |deep copy   |node.js only              |
|DataView          |deep copy   |                          |
|Date              |deep copy   |                          |
|Number            |deep copy   |                          |
|RegExp            |deep copy   |                          |
|String            |deep copy   |                          |
|Float32Array      |deep copy   |                          |
|Float64Array      |deep copy   |                          |
|Int16Array        |deep copy   |                          |
|Int32Array        |deep copy   |                          |
|Int8Array         |deep copy   |                          |
|Uint16Array       |deep copy   |                          |
|Uint32Array       |deep copy   |                          |
|Uint8Array        |deep copy   |                          |
|Uint8ClampedArray |deep copy   |                          |
|boolean           |deep copy   |                          |
|null              |deep copy   |                          |
|number            |deep copy   |                          |
|string            |deep copy   |                          |
|symbol            |deep copy   |                          |
|undefined         |deep copy   |                          |
|Arguments         |deep copy   |recursively, copy as Array|
|Array             |deep copy   |recursively               |
|Map               |deep copy   |recursively               |
|Object            |deep copy   |recursively               |
|Set               |deep copy   |recursively               |
|Array Iterator    |shallow copy|                          |
|Map Iterator      |shallow copy|                          |
|Promise           |shallow copy|                          |
|Set Iterator      |shallow copy|                          |
|String Iterator   |shallow copy|                          |
|function          |shallow copy|                          |
|global            |shallow copy|window, global, self, etc.|
|WeakMap           |shallow copy|                          |
|WeakSet           |shallow copy|                          |

## Contributors

- [kjirou](https://github.com/kjirou)
- [Pr0methean](https://github.com/Pr0methean)

## License

The MIT license.
