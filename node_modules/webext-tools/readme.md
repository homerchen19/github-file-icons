# webext-tools [![npm version](https://img.shields.io/npm/v/webext-tools.svg)](https://www.npmjs.com/package/webext-tools)

> Utility functions for Web Extensions

- Browsers: Chrome, Firefox, and Safari
- Manifest: v2 and v3
- Permissions: In manifest v3, you'll need the `scripting` permission
- Context: They can be called from any context that has access to the `chrome.tabs` or `chrome.scripting` APIs

**Sponsored by [PixieBrix](https://www.pixiebrix.com)** :tada:

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-tools&name=window) and include it in your `manifest.json`. Or use npm:

```sh
npm install webext-tools
```

```js
// This module is only offered as a ES Module
import {
	getTabUrl,
	addOptionsContextMenu,
} from 'webext-tools';
```

## Usage

### `getTabUrl(tabId)`
### `getTabUrl({tabId, frameId})`

A no-error function to retrieve a tab or frame’s URL with a plain `activeTab` permission (or regular host/`tabs` permissions).

```js
const tabId = 42;
const url = await getTabUrl(tabId);
if (url) {
	console.log('The url is', url);
} else {
	console.warn('We have no access to the tab');
}
```

```js
const url = await getTabUrl({
	tabId: 42,
	frameId: 56,
});
if (url) {
	console.log('The url is', url);
} else {
	console.warn('We have no access to the frame');
}
```

### `doesTabExist(tabId)`

Checks whether the tab exists.

```js
const tabId = 42;
const tabExists = await doesTabExist(tabId);
if (tabExists) {
	chrome.tabs.remove(tabExists);
}
```

### `setActionPopup(getPopupUrl)`

Sets the popup URL (or removes the popup) depending on the current tab. This listens to tab changes and it will call the `getPopupUrl` callback to let you determine what popup to show. The callback can also be an async function.

This can be combined with `chrome.action.onClicked` to toggle between callback and popup.

The `tabs` permission is required for this.

```js
chrome.action.onClicked.addListener(() => {
	console.log('Browser action was clicked on a tab other than Google’s')
});
setActionPopup(tabUrl => {
	return String(tabUrl).startsWith('https://google.com')
		? './google-popup.html'
		: undefined;
})
```

### `addOptionsContextMenu()`

Chrome lets user reach the options via browser action context menu. However in Safari and Firefox you need a few more clicks to reach it.

This helper will automatically add an "Options…" menu item to the browser action context menu to both Safari and Firefox. Nothing happens in Chrome.

Requirements:

- `action` or `browser_action` specified in your manifest.json
- `contextMenu` permission

## Related

- [webext-content-scripts](https://github.com/fregante/webext-content-scripts) - Utility functions to inject content scripts in WebExtensions.
- [webext-base-css](https://github.com/fregante/webext-base-css) - Extremely minimal stylesheet/setup for Web Extensions’ options pages (also dark mode)
- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options.
- [webext-detect](https://github.com/fregante/webext-detect) - Detects where the current browser extension code is being run.
- [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts) - Automatically registers your content_scripts on domains added via permission.request
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
