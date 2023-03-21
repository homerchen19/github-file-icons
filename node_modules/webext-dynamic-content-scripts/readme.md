# webext-dynamic-content-scripts [![npm version](https://img.shields.io/npm/v/webext-dynamic-content-scripts.svg)](https://www.npmjs.com/package/webext-dynamic-content-scripts)

> WebExtension module: Automatically registers your `content_scripts` on domains added via `permission.request`

For example, when your users enable more domains via [webext-domain-permission-toggle](https://github.com/fregante/webext-domain-permission-toggle), this module will automatically register your `content_scripts` from `manifest.json` into the new domain.

The main use case is to add support for _GitHub/GitLab Enterprise_ domains to your GitHub/GitLab extension: you start with `github.com` and then users can add new domains; this way you don't need to use a broad `<all_urls>` permission.

Tested in Chrome, Firefox, and Safari.

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

Include `webext-dynamic-content-scripts` as a background script and add `optional_permissions` to allow new permissions to be added. The scripts defined in `content_scripts` will be added on the new domains (`matches` will be replaced)

```json
// example manifest.json
{
	"optional_permissions": [
		"*://*/*"
	],
	"background": {
		"scripts": [
			"webext-dynamic-content-scripts.js",
			"background.js"
		]
	},
	"content_scripts": [
		{
			"matches": [
				"https://github.com/*"
			],
			"css": [
				"content.css"
			],
			"js": [
				"content.js"
			]
		}
	]
}
```

## Permissions for Chrome

This section does not apply to Firefox users.

In order to use `all_frames: true` you should the add [`webNavigation` permission](https://developer.chrome.com/docs/extensions/reference/webNavigation/). Without it, `all_frames: true` won’t work:

- when the iframe is not on the same domain as the top frame
- when the iframe reloads or navigates to another page
- when the iframe is not ready when `runAt` is configured to run (`runAt: 'start'` is unlikely to work)

If available, the `webNavigation` API will be automatically used in every situation for better performance.

## Related

### Permissions

- [webext-domain-permission-toggle](https://github.com/fregante/webext-domain-permission-toggle) - Browser-action context menu to request permission for the current tab. Chrome and Firefox.
- [webext-additional-permissions](https://github.com/fregante/webext-additional-permissions) - Get any optional permissions that users have granted you.

### Others

- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options. Chrome and Firefox.
- [webext-storage-cache](https://github.com/fregante/webext-storage-cache) - Map-like promised cache storage with expiration. Chrome and Firefox
- [webext-detect-page](https://github.com/fregante/webext-detect-page) - Detects where the current browser extension code is being run. Chrome and Firefox.
- [web-ext-submit](https://github.com/fregante/web-ext-submit) - Wrapper around Mozilla’s web-ext to submit extensions to AMO.
- [Awesome-WebExtensions](https://github.com/fregante/Awesome-WebExtensions) - A curated list of awesome resources for WebExtensions development.

## License

MIT © [Federico Brigante](https://fregante.com)
