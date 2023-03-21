# webext-polyfill-kinda [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/webext-polyfill-kinda.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=webext-polyfill-kinda

> Super-lightweight Promised wrapper around `chrome.*` APIs to be used in modules.

✅ Use this module when publishing your own micro-modules. This avoids having to import `webextension-polyfill` as a sub-dependency.

❌ Do not use this module if you need promised APIs directly in your extension. [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) is much safer.

⚠️ This package isn't completely safe to use because it blindly wraps the `chrome.*` APIs whether it supports them or not.

Please test your module in every browser before assuming it works, or prefer `webextension-polyfill`.

## Install

```sh
npm install webext-polyfill-kinda
```

## Usage

```js
import chromeP from 'webext-polyfill-kinda';

(async () => {
	// Cases where the API works
	const currentTab = await chromeP.tabs.getCurrent();
	const options = await chromeP.storage.local.get('options');

	// Do not use `chromeP` when dealing with listeners, it doesn't make sense. Use the native `chrome.*` API
	chrome.tabs.onUpdated.addListener(listener);
})();
```

## TypeScript Usage

`chromeP` will reuse the global `browser` type if it exists. The suggested solution is to also install this, the types will be automatically available.

```sh
npm install @types/firefox-webext-browser --save-dev
```

## Related

- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options. Chrome and Firefox.
- [webext-storage-cache](https://github.com/fregante/webext-storage-cache) - Map-like promised cache storage with expiration. Chrome and Firefox
- [web-ext-submit](https://github.com/fregante/web-ext-submit) - Wrapper around Mozilla’s web-ext to submit extensions to AMO.
- [Awesome-WebExtensions](https://github.com/fregante/Awesome-WebExtensions) - A curated list of awesome resources for WebExtensions development.

## License

MIT © [Federico Brigante](https://fregante.com)
