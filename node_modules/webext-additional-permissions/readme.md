# webext-additional-permissions [![npm version](https://img.shields.io/npm/v/webext-additional-permissions.svg)](https://www.npmjs.com/package/webext-additional-permissions)

> WebExtensions module: Get any optional permissions that users have granted you.

`chrome.permissions.getAll()` will report all permissions, whether they're part of the manifest’s `permissions` field or if they've been granted later via `chrome.permissions.request`.

`webext-additional-permissions` will return the same `Permissions` object but it will only include any permissions that the user might have granted to the extension.

Compatible with Chrome 69+ and Firefox 62+ (both released in September 2018.)

Like the regular `chrome.permissions` API, **this module does not work in content scripts.**

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-additional-permissions&global=getAdditionalPermissions) and include it in your `manifest.json`.

Or use `npm`:

```sh
npm install webext-additional-permissions
# If you're using TypeScript, I suggest also installing @types/chrome
```

```js
// This module is only offered as a ES Module
import {
	getAdditionalPermissions,
	getManifestPermissions,
} from 'webext-additional-permissions';
```

## Usage

```json
// example manifest.json
{
	"permissions": [
		"https://google.com/*",
		"storage"
	],
	"optional_permissions": [
		"https://*/*"
	]
}
```

Simple example with the above manifest:

```js
(async () => {
	const newPermissions = await getAdditionalPermissions();
	// => {origins: [], permissions: []}

	const manifestPermissions = await getManifestPermissions();
	// => {origins: ['https://google.com/*'], permissions: ['storage']}
})();
```

Example showing how the result changes when you add further permissions (for example via [webext-domain-permission-toggle](https://github.com/fregante/webext-domain-permission-toggle))

```js
async function onGrantPermissionButtonClick() {
	await browser.permissions.request({origins: ['https://facebook.com/*']});

	// Regular `browser` API: returns manifest permissions and new permissions
	const allPermissions = await browser.permissions.getAll();
	// => {origins: ['https://google.com/*', 'https://facebook.com/*'], permissions: ['storage']}

	// This module: only the new permission is returned
	const newPermissions = await getAdditionalPermissions();
	// => {origins: ['https://facebook.com/*'], permissions: []}

	// This module: the manifest permissions are unchanged
	const manifestPermissions = await getManifestPermissions();
	// => {origins: ['https://google.com/*'], permissions: ['storage']}
}
```

## API

### getAdditionalPermissions(options)

Returns a promise that resolves with a [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object like `chrome.permissions.getAll` and `browser.permissions.getAll`, but only includes the optional permissions that the user granted you.

#### options

Type: `object`

##### strictOrigins

Type: `boolean`\
Default: `true`

If manifest contains the permission `https://github.com/*` and then request `*://*.github.com/*` ([like Safari does](https://github.com/fregante/webext-additional-permissions/issues/1)), the latter will be considered an _additional permission_ because technically it's broader.

If this distinction doesn't matter for you (for example if the protocol is always `https` and there are no subdomains), you can use `strictOrigins: false`, so that the requested permission will not be reported as _additional_.

### selectAdditionalPermissions(permissions, options)

Like `getAdditionalPermissions`, but instead of querying the current permissions, you can pass a [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object.

#### permissions

Type: [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object.

#### options

Type: `object`

Same as [getAdditionalPermissions](#getadditionalpermissionsoptions).

### selectAdditionalPermissionsSync(permissions, options)

Same as `selectAdditionalPermissions` but it doesn't return a Promise.

### getManifestPermissions()

Returns a promise that resolves with a [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object listing the permissions inferred from the manifest file.

Differences from `chrome.runtime.getManifest().permissions`:

- this function also includes host permissions inferred from all the content scripts
- this function also includes the `devtools` permission inferred from the `devtools_page`, if present

Difference from `chrome.permissions.getAll`:

- this function only includes the permissions you declared in `manifest.json`.

### getManifestPermissionsSync()

Same as `getManifestPermissions` but it doesn't return a Promise.

### dropOverlappingPermissions(permissions)

`*://*/*` includes every URL also matched by `https://fregante.com/*`, so the latter is overlapping.

This function accepts a [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object and it drops any permissions that are overlapping. Currently this only applies to origin permissions.

### isUrlPermittedByManifest(url)

Check whether a specific URL is statically permitted by the manifest, whether in the `permissions` array or in a content script. Like `chrome.permissions.contains` except:

- it's synchronous
- it's only `true` if the URL is in the manifest (additional permissions are not taken into consideration)

## Related

### Permissions

- [webext-domain-permission-toggle](https://github.com/fregante/webext-domain-permission-toggle) - Browser-action context menu to request permission for the current tab. Chrome and Firefox.
- [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts) - Automatically registers your content_scripts on domains added via permission.request

### Others

- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options. Chrome and Firefox.
- [webext-storage-cache](https://github.com/fregante/webext-storage-cache) - Map-like promised cache storage with expiration. Chrome and Firefox
- [webext-detect-page](https://github.com/fregante/webext-detect-page) - Detects where the current browser extension code is being run. Chrome and Firefox.
- [web-ext-submit](https://github.com/fregante/web-ext-submit) - Wrapper around Mozilla’s web-ext to submit extensions to AMO.
- [Awesome-WebExtensions](https://github.com/fregante/Awesome-WebExtensions) - A curated list of awesome resources for WebExtensions development.

## License

MIT © [Federico Brigante](https://fregante.com)
