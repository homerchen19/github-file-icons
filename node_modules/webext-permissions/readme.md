# webext-permissions [![npm version](https://img.shields.io/npm/v/webext-permissions.svg)](https://www.npmjs.com/package/webext-permissions)

> WebExtensions module: Get any optional permissions that users have granted you + other utilities

- Browsers: Chrome, Firefox, and Safari
- Manifest: v2 and v3
- Context: Any context that has access to the `chrome.permissions` API

_This package was recently renamed from `webext-additional-permissions` to `webext-permissions`_

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-permissions&global=webextPermissions) and include it in your `manifest.json`._

Or use `npm`:

```sh
npm install webext-permissions
# If you're using TypeScript, also run
npm install -D @types/chrome
```

```js
// This module is only offered as a ES Module
import {
	queryAdditionalPermissions,
	normalizeManifestPermissions,
} from 'webext-permissions';
```

## Usage

`chrome.permissions.getAll()` will report all permissions, whether they're part of the manifest’s `permissions` field or if they've been granted later via `chrome.permissions.request`.

`webext-permissions` will return the same `Permissions` object but it will only include any permissions that the user might have granted to the extension.

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
	const newPermissions = await queryAdditionalPermissions();
	// => {origins: [], permissions: []}

	const manifestPermissions = normalizeManifestPermissions();
	// => {origins: ['https://google.com/*'], permissions: ['storage']}
})();
```

Example showing how the result changes when you add further permissions (for example via [webext-permission-toggle](https://github.com/fregante/webext-permission-toggle))

```js
async function onGrantPermissionButtonClick() {
	await browser.permissions.request({origins: ['https://facebook.com/*']});

	// Regular `browser` API: returns manifest permissions and new permissions
	const allPermissions = await browser.permissions.getAll();
	// => {origins: ['https://google.com/*', 'https://facebook.com/*'], permissions: ['storage']}

	// This module: only the new permission is returned
	const newPermissions = await queryAdditionalPermissions();
	// => {origins: ['https://facebook.com/*'], permissions: []}

	// This module: the manifest permissions are unchanged
	const manifestPermissions = normalizeManifestPermissions();
	// => {origins: ['https://google.com/*'], permissions: ['storage']}
}
```

## API

### queryAdditionalPermissions(options)

Returns a promise that resolves with a [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object like `chrome.permissions.getAll` and `browser.permissions.getAll`, but only includes the optional permissions that the user granted you.

#### options

Type: `object`

##### strictOrigins

Type: `boolean`\
Default: `true`

If the manifest contains the permission `https://github.com/*` and then you request `*://*.github.com/*` ([like Safari does](https://github.com/fregante/webext-permissions/issues/1)), the latter will be considered an _additional permission_ because technically it's broader.

If this distinction doesn't matter for you (for example if the protocol is always `https` and there are no subdomains), you can use `strictOrigins: false`, so that the requested permission will not be reported as _additional_.

### extractAdditionalPermissions(currentPermissions, options)

Like `queryAdditionalPermissions`, but instead of querying the current permissions, you can pass a [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object.

This function returns synchronously.

#### permissions

Type: [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object.

#### options

Type: `object`

##### strictOrigins

Type: `boolean`\
Default: `true`

See [strictOrigins](#strictorigins) above

##### manifest

Type: `object`
Default: `chrome.runtime.getManifest()`

The whole `manifest.json` object to be parsed. By default it asks the browser to provide it.

### normalizeManifestPermissions(manifest)

Returns a [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object listing the permissions inferred from the manifest file.

Differences from `chrome.runtime.getManifest().permissions`:

- this function always returns a `{origin, permissions}` object rather than a flat `permissions` array, even in MV3
- this function also includes host permissions inferred from all the content scripts
- this function also includes the `devtools` permission inferred from the `devtools_page`, if present

Difference from `chrome.permissions.getAll`:

- this function only includes the permissions you declared in `manifest.json`.

#### manifest

Type: `object`
Default: `chrome.runtime.getManifest()`

The whole `manifest.json` object to be parsed. By default it asks the browser to provide it.

### dropOverlappingPermissions(permissions)

`*://*/*` includes every URL also matched by `https://fregante.com/*`, so the latter is overlapping.

This function accepts a [`Permissions`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/permissions/Permissions) object and it drops any permissions that are overlapping. Currently this only applies to origin permissions.

You can alternatively use the underlying [`excludeDuplicatePatterns` in `webext-patterns`](https://github.com/fregante/webext-patterns#excludeduplicatepatternspattern1-pattern2-etc) if you want to use raw arrays of origins.

### isUrlPermittedByManifest(url, manifest)

Check whether a specific URL is statically permitted by the manifest, whether in the `permissions` array or in a content script. Like `chrome.permissions.contains` except:

- it's synchronous
- it's only `true` if the URL is in the manifest (additional permissions are not taken into consideration)

#### manifest

Type: `object`
Default: `chrome.runtime.getManifest()`

The whole `manifest.json` object to be parsed. By default it asks the browser to provide it.

## Related

- [webext-patterns](https://github.com/fregante/webext-patterns) - Convert the patterns of your WebExtension manifest to regex
- [webext-permission-toggle](https://github.com/fregante/webext-permission-toggle) - Browser-action context menu to request permission for the current tab.
- [webext-detect](https://github.com/fregante/webext-detect) - Detects where the current browser extension code is being run. Chrome and Firefox.
- [Awesome-WebExtensions](https://github.com/fregante/Awesome-WebExtensions) - A curated list of awesome resources for WebExtensions development.
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
