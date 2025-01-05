# webext-content-scripts [![npm version](https://img.shields.io/npm/v/webext-content-scripts.svg)](https://www.npmjs.com/package/webext-content-scripts)

> Utility functions to inject content scripts in WebExtensions, for Manifest v2 and v3.

- Browsers: Chrome, Firefox, and Safari
- Manifest: v2 and v3
- Permissions: In manifest v3, you'll need the `scripting` permission
- Context: They can be called from any context that has access to the `chrome.tabs` or `chrome.scripting` APIs

**Sponsored by [PixieBrix](https://www.pixiebrix.com)** :tada:

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-content-scripts&name=window) and include it in your `manifest.json`. Or use npm:

```sh
npm install webext-content-scripts
```

```js
// This module is only offered as a ES Module
import {
	executeScript,
	insertCSS,
	injectContentScript,
	executeFunction,
	canAccessTab,
} from 'webext-content-scripts';
```

## Usage

### `executeScript`

Like `chrome.tabs.executeScript` but:

- it works on Manifest v3
- it can execute multiple scripts at once

```js
executeScript({
	tabId: 1,
	frameId: 20,
	files: ['react.js', 'main.js'],
});
```

```js
executeScript({
	tabId: 1,
	frameId: 20,
	files: [
		{file: 'react.js'},
		{code: 'console.log(42)'}, // This will fail on Manifest v3
	],
});
```

### `insertCSS`

Like `chrome.tabs.insertCSS` but:

- it works on Manifest v3
- it can insert multiple styles at once

```js
insertCSS({
	tabId: 1,
	frameId: 20,
	files: ['bootstrap.css', 'style.css'],
});
```

```js
insertCSS({
	tabId: 1,
	frameId: 20,
	files: [
		{file: 'bootstrap.css'},
		{code: 'hmtl { color: red }'}
	],
});
```

### `injectContentScript(targets, scripts)`

It combines `executeScript` and `injectCSS` in a single call. You can pass the entire `content_script` object from the manifest too, without change (even with `snake_case_keys`). It accepts either an object or an array of objects.

### targets

This can be a tab ID, an array of tab IDs, a specific tab/frame combination, an array of such combinations:

```js
injectContentScript(1, scripts);
injectContentScript([1, 2], scripts)
injectContentScript({tabId: 1, frameId: 0}, scripts);
injectContentScript([{tabId: 1, frameId: 0}, {tabId: 23, frameId: 98765}], scripts);

// You can also use the exported `getTabsByUrl` utility to inject by URL as well
injectContentScript(await getTabsByUrl(['https://example.com/*']), scripts);
```

### Examples

```js
const tabId = 42;
await injectContentScript(tabId, {
	runAt: 'document_idle',
	allFrames: true, // Default when passing frame-less tab IDs
	matchAboutBlank: true,
	js: [
		'contentscript.js'
	],
	css: [
		'style.css'
	],
})
```

```js
await injectContentScript({
	tabId: 42,
	frameId: 56
}, [
	{
		js: [
			'jquery.js',
			'contentscript.js'
		],
		css: [
			'bootstrap.css',
			'style.css'
		],
	},
	{
	runAt: 'document_start',
		css: [
			'more-styles.css'
		],
	}
])
```

```js
const tabId = 42;
const scripts = browser.runtime.getManifest().content_scripts;
// `matches`, `exclude_matches`, etc are ignored, so you can inject them on any host that you have permission to
await injectContentScript(tabId, scripts);
```

### `executeFunction(tabId, function, ...arguments)`

### `executeFunction({tabId, frameId}, function, ...arguments)`

Like `chrome.tabs.executeScript`, except that it accepts a raw function to be executed in the chosen tab.

```js
const tabId = 10;

const tabUrl = await executeFunction(tabId, () => {
	alert('This code is run as a content script');
	return location.href;
});

console.log(tabUrl);
```

Note: The function must be self-contained because it will be serialized.

```js
const tabId = 10;
const catsAndDogs = 'cute';

await executeFunction(tabId, () => {
	console.log(catsAndDogs); // ERROR: catsAndDogs will be undeclared and will throw an error
});
```

you must pass it as arguments:

```js
const tabId = 10;
const catsAndDogs = 'cute';

await executeFunction(tabId, (localCatsAndDogs) => {
	console.log(localCatsAndDogs); // It logs "cute"
}, catsAndDogs); // Argument
```

### `canAccessTab(tabId)`

### `canAccessTab({tabId, frameId})`

Checks whether the extension has access to a specific tab or frame (i.e. content scripts are allowed to run), either via `activeTab` permission or regular host permissions.

```js
const tabId = 42;
const access = await canAccessTab(tabId);
if (access) {
	console.log('We can access this tab');
	chrome.tabs.executeScript(tabId, {file: 'my-script.js'});
} else {
	console.warn('We have no access to the tab');
}
```

```js
const access = await canAccessTab({
	tabId: 42,
	frameId: 56,
});
if (access) {
	console.log('We can access this frame');
	chrome.tabs.executeScript(42, {file: 'my-script.js', frameId: 56});
} else {
	console.warn('We have no access to the frame');
}
```

### `isScriptableUrl(url)`

Browsers block access to some URLs for security reasons. This function will check whether a passed URL is blocked. Permissions and the manifest are not checked, this function is completely static. It will also returns `false` for any URL that doesn't start with `http`.

More info may be found on:

- https://stackoverflow.com/q/11613371/288906
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts

```js
const url = 'https://addons.mozilla.org/en-US/firefox/addon/ghosttext/';
if (isScriptableUrl(url)) {
	console.log('I can inject content script to this page if permitted');
} else {
	console.log('Content scripts are never allowed on this page');
}
```

## Related

- [webext-tools](https://github.com/fregante/webext-tools) - Utility functions for Web Extensions.
- [webext-domain-permission-toggle](https://github.com/fregante/webext-domain-permission-toggle) - Browser-action context menu to request permission for the current tab.
- [webext-permissions](https://github.com/fregante/webext-permissions) - Get any optional permissions that users have granted you.
- [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts) - Automatically registers your content_scripts on domains added via permission.request
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
