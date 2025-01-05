# dom-loaded

> Check when the DOM has loaded like [`DOMContentLoaded`](https://developer.mozilla.org/en/docs/Web/Events/DOMContentLoaded)

Unlike `DOMContentLoaded`, this also works when included after the DOM was loaded.

## Install

```sh
npm install dom-loaded
```

## Usage

```js
import domLoaded from 'dom-loaded';

await domLoaded;
console.log('The DOM is now loaded.');
```

## API

### domLoaded

Type: `Promise<void>`

The promise resolves when the DOM finishes loading or right away if the DOM has already loaded.

### domLoaded.hasLoaded

Type: `boolean`

Synchronously check if the DOM has already finished loading.

### domLoaded.signal

Type: [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

An `AbortSignal` that triggers when the DOM finishes loading or immediately if it has already loaded.

## Related

- [element-ready](https://github.com/sindresorhus/element-ready) - Detect when an element is ready in the DOM
