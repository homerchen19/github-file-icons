# webext-dynamic-content-scripts [![npm version](https://img.shields.io/npm/v/webext-dynamic-content-scripts.svg)](https://www.npmjs.com/package/webext-dynamic-content-scripts)

> WebExtension module: Automatically registers your `content_scripts` on domains added via `permissions.request`

- Browsers: Chrome, Firefox, and Safari
- Manifest: v2 and v3

This module will automatically register your `content_scripts` from `manifest.json` into new domains granted via `permissions.request()`, or via [webext-permission-toggle](https://github.com/fregante/webext-permission-toggle).

The main use case is ship your extension with a minimal set of hosts and then allow the user to enable it on any domain; this way you don't need to use a broad `<all_urls>` permission.

## Guides

[**How to let your users enable your extension on any domain.**](how-to-add-github-enterprise-support-to-web-extensions.md)

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-dynamic-content-scripts) and include it in your `manifest.json`. Or use npm:

```sh
npm install webext-dynamic-content-scripts
```

```js
// This module is only offered as a ES Module
import 'webext-dynamic-content-scripts';
```

## Usage

_For Manifest v2, refer to the [usage-mv2](./usage-mv2.md) documentation._

You need to:

- import `webext-dynamic-content-scripts` in the worker (no functions need to be called)
- specify `optional_host_permissions` in the manifest to allow new permissions to be added
- specify at least one `content_scripts`

```js
// example background.worker.js
navigator.importScripts('webext-dynamic-content-scripts.js');
```

```json
// example manifest.json
{
	"permissions": ["scripting", "storage"],
	"optional_host_permissions": ["*://*/*"],
	"background": {
		"service_worker": "background.worker.js"
	},
	"content_scripts": [
		{
			"matches": ["https://github.com/*"],
			"css": ["content.css"],
			"js": ["content.js"]
		}
	]
}
```

### `activeTab` tracking

By default, the module will only inject the content scripts into newly-permitted hosts, but it will ignore temporary permissions like `activeTab`. If you also want to automatically inject the content scripts into every frame of tabs as soon as they receive the `activeTab` permission, import a different entry point **instead of the default one.**

```js
import 'webext-dynamic-content-scripts/including-active-tab.js';
```

> **Note**
> This does not work well in Firefox because of some compounding bugs:
> - `activeTab` seems to be lost after a reload
> - further `contextMenu` clicks receive a moz-extension URL rather than the current page’s URL

### Additional APIs

#### `isContentScriptRegistered(url)`

You can detect whether a specific URL will receive the content scripts by importing the `utils` file:

```js
import {isContentScriptRegistered} from 'webext-dynamic-content-scripts/utils.js';

if (await isContentScriptRegistered('https://google.com/search')) {
	console.log('Either way, the content scripts are registered');
}
```

`isContentScriptRegistered` returns a promise that resolves with a string indicating the type of injection (`'static'` or `'dynamic'`) or `false` if it won't be injected on the specified URL.

## Related

- [webext-permission-toggle](https://github.com/fregante/webext-permission-toggle) - Browser-action context menu to request permission for the current tab.
- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options.
- [webext-detect](https://github.com/fregante/webext-detect) - Detects where the current browser extension code is being run.
- [Awesome-WebExtensions](https://github.com/fregante/Awesome-WebExtensions) - A curated list of awesome resources for WebExtensions development.
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
