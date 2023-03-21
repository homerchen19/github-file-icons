# webext-detect-page [![](https://img.shields.io/npm/v/webext-detect-page.svg)](https://www.npmjs.com/package/webext-detect-page)

> Detects where the current browser extension code is being run. Chrome and Firefox.

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-detect-page&global=window) and include it in your `manifest.json`.

Or use `npm`:

```sh
npm install webext-detect-page
```

```js
// This module is only offered as a ES Module
import {
	isBackgroundPage,
	isContentScript,
	isOptionsPage
} from 'webext-detect-page';
```

## Usage

```js
import {isBackgroundPage} from 'webext-detect-page';

if (isBackgroundPage()) {
	// Run background code, e.g.
	browser.runtime.onMessage.addListener(console.log);
} else if (isContentScript) {
	// Run content script code, e.g.
	browser.runtime.sendMessage('wow!');
}
```

## API

The functions are only ever evaluated once. This protects from future "invalidated context" errors. Read the note about [testing](#testing) if you're running this code in a tester.

#### isWebPage()

Returns a `boolean` that indicates whether the code is being run on `http(s)://` pages (it could be in a content script or regular web context).

#### isExtensionContext()

Returns a `boolean` that indicates whether the code is being run in extension contexts that have access to the chrome API.

#### isBackgroundPage()

Returns a `boolean` that indicates whether the code is being run in a background page.

#### isContentScript()

Returns a `boolean` that indicates whether the code is being run in a content script.

#### isOptionsPage()

Returns a `boolean` that indicates whether the code is being run in an options page. This only works if the current page’s URL matches the one specified in the extension's `manifest.json`.

#### isDevToolsPage()

Returns a `boolean` that indicates whether the code is being run in a dev tools page. This only works if the current page’s URL matches the one specified in the extension's `manifest.json` `devtools_page` field.

#### isChrome()
#### isFirefox()
#### isSafari()

Returns a `boolean` if it matches the current browser. They are loose detections based on the user agent that are useful when developing Web Extensions.

#### getContextName()

Returns the first matching context among those defined in `index.ts`, depending on the current context:

- 'contentScript'
- 'backgroundPage'
- 'options'
- 'devToolsPage'
- 'extension'
- 'web'
- 'unknown'

## Testing

The calls are automatically cached so, if you're using this in a test environment, import and call this function first to ensure that the environment is "detected" every time:

```js
import {disableWebextDetectPageCache} from 'webext-detect-page';
disableWebextDetectPageCache();
```

## Related

- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options.
- [webext-storage-cache](https://github.com/fregante/webext-storage-cache) - Map-like promised cache storage with expiration.
- [webext-domain-permission-toggle](https://github.com/fregante/webext-domain-permission-toggle) - Browser-action context menu to request permission for the current tab.
- [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts) - Automatically inject your `content_scripts` on custom domains.
- [webext-content-script-ping](https://github.com/fregante/webext-content-script-ping) - One-file interface to detect whether your content script have loaded.
- [`Awesome WebExtensions`](https://github.com/fregante/Awesome-WebExtensions): A curated list of awesome resources for Web Extensions development

## License

MIT © [Federico Brigante](https://fregante.com)
