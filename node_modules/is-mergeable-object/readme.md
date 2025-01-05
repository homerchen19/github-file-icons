# is-mergeable-object

<!--js
const isMergeableObject = require('./')
-->

The biggest difficulty deep merge libraries run into is figuring out which properties of an object should be recursively iterated over.

This module contains the algorithm used by [`deepmerge`](https://github.com/KyleAMathews/deepmerge/).

<!--js
const someReactElement = {
	$$typeof: Symbol.for('react.element')
}
-->

```js
isMergeableObject(null) // => false

isMergeableObject({}) // => true

isMergeableObject(new RegExp('wat')) // => false

isMergeableObject(undefined) // => false

isMergeableObject(new Object()) // => true

isMergeableObject(new Date()) // => false

isMergeableObject(someReactElement) // => false
```
