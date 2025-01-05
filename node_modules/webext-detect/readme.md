# webext-detect [![](https://img.shields.io/npm/v/webext-detect.svg)](https://www.npmjs.com/package/webext-detect)

> Detects where the current browser extension code is being run.

> This package was recently renamed from `webext-detect-page` to `webext-detect`

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-detect&global=window) and include it in your `manifest.json`.

Or use `npm`:

```sh
npm install webext-detect
```

## Usage

```js
import {isBackground, isContentScript} from 'webext-detect';

if (isBackground()) {
	// Run background code, e.g.
	browser.runtime.onMessage.addListener(console.log);
} else if (isContentScript()) {
	// Run content script code, e.g.
	browser.runtime.sendMessage('wow!');
}
```

## API

The functions are only ever evaluated once. This protects from future "invalidated context" errors. Read the note about [testing](#testing) if you're running this code in a tester.

To see all the available functions, check the [index.d.ts](https://www.unpkg.com/browse/webext-detect/index.d.ts) file.

There are also a few helper functions based on the useragent string to loosely detect the current browser: `isChrome()`, `isFirefox()`, `isSafari()`, `isMobileSafari()`. They are not intended to detect forks, but just the main engines.

## Testing

The calls are automatically cached so, if you're using this in a test environment, import and call this function first to ensure that the environment is "detected" every time:

```js
import {disableWebextDetectPageCache} from 'webext-detect';
disableWebextDetectPageCache();
```

## Related

- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options.
- [webext-storage-cache](https://github.com/fregante/webext-storage-cache) - Map-like promised cache storage with expiration.
- [webext-patterns](https://github.com/fregante/webext-patterns) - Utilities for patterns and globs.
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
