# content-scripts-register-polyfill [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/content-scripts-register-polyfill.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=content-scripts-register-polyfill

> WebExtensions: Polyfill for [browser.contentScripts.register()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contentScripts/register) for Chrome and Safari.

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=content-scripts-register-polyfill) and include it in your `manifest.json`.

```sh
npm install content-scripts-register-polyfill
```

```js
import 'content-scripts-register-polyfill';
```

## Usage

Include the script via `manifest.json`, then refer to the original [`contentScripts.register()`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contentScripts/register) documentation.

```js
const registeredScript = await chrome.contentScripts.register({
	js: [{
		file: 'myfile.js'
	}],
	matches: [
		'https://google.com/*'
	]
});
```

Additionally, if you're using [webextension-polyfill](https://github.com/mozilla/webextension-polyfill), you can also use it with the original `browser.*` name: `browser.contentsScripts.register()`

```js
const registeredScript = await browser.contentScripts.register({
	js: [{
		file: 'myfile.js'
	}],
	matches: [
		'https://google.com/*'
	]
});
```

### Usage as ponyfill

This package also exports a [ponyfill](https://ponyfill.com/), meaning you can also use it as a normal API isntead of treating it as a polyfill. This way it will always use the current code and never rely on Firefox’ native implementation.

```js
import registerContentScript from 'content-scripts-register-polyfill/ponyfill.js';

const registeredScript = await registerContentScript({
	js: [{
		file: 'myfile.js'
	}],
	matches: [
		'https://google.com/*'
	],
	excludeMatches: [ // Also supported
		'https://google.com/search*'
	]
});
```

### TypeScript

Starting in v3, the types are no longer included. You have a few options:

- if you're using [webextension-polyfill-ts](https://github.com/Lusito/webextension-polyfill-ts) it will automatically work
- if you're using [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) and the `browser.*` API, install its types
  ```sh
  npm install -D @types/firefox-webext-browser
  ```
- if you want to use it as `chrome.contentScripts.register()` or as a [ponyfill](#ponyfill), you might need to install two type packages:
  ```sh
  npm install -D @types/firefox-webext-browser @types/chrome
  ```

## Permission

Generally you don't need any permissions other than the host permission you want to register a script on.

However, in order to use `allFrames: true` you should the add [`webNavigation` permission](https://developer.chrome.com/docs/extensions/reference/webNavigation/). Without it, `allFrames: true` won’t work:

- when the iframe is not on the same domain as the top frame
- when the iframe reloads or navigates to another page
- when the iframe is not ready when `runAt` is configured to run (`runAt: 'start'` is unlikely to work)

If available, the `webNavigation` API will be automatically used in every situation for better performance.

## Related

- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options.
- [webext-domain-permission-toggle](https://github.com/fregante/webext-domain-permission-toggle) - Browser-action context menu to request permission for the current tab.
- [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts) - Automatically inject your `content_scripts` on custom domains.
- [webext-detect-page](https://github.com/fregante/webext-detect-page) - Detects where the current browser extension code is being run.
- [webext-content-script-ping](https://github.com/fregante/webext-content-script-ping) - One-file interface to detect whether your content script have loaded.
- [`Awesome WebExtensions`](https://github.com/fregante/Awesome-WebExtensions): A curated list of awesome resources for Web Extensions development.

## License

MIT © [Federico Brigante](https://fregante.com)
