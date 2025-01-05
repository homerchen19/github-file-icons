# webext-alert [![npm version](https://img.shields.io/npm/v/webext-alert.svg)](https://www.npmjs.com/package/webext-alert)

> WebExtension module: alert() for background pages/workers in Web Extensions

- Browsers: Chrome, Firefox, Safari
- Manifest: v2 and v3
- Contexts: All contexts

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-alert&global=webextAlert) and include it in your `manifest.json`.

Or use `npm`:

```sh
npm install webext-alert
```

```js
import alert from 'webext-alert';
```

## Usage

```js
alert('Hello from background script!');
```

<img width="420" alt="alert from service worker in MV3" src="https://github.com/fregante/webext-alert/assets/1402241/bc25c6dc-633a-40f9-91f2-04d0cca16300">

## API

### alert(message)

Uses `alert()` wherever possible, but falls back to a custom window with the same content.

If the native `alert` is used, this will block the execution of the background script until the user closes the alert.

If the custom window is used, `webextAlert` will return a promise that resolves when the user closes the window.

## Known issues

- If the user is using a full screen window on macOS or they're on mobile, a whole new window will be opened instead of a popup. This is a limitation of the WebExtensions API.

## Related

- [Awesome-WebExtensions](https://github.com/fregante/Awesome-WebExtensions) - A curated list of awesome resources for WebExtensions development.
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
