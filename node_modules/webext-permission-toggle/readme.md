# webext-permission-toggle [![npm version](https://img.shields.io/npm/v/webext-permission-toggle.svg)](https://www.npmjs.com/package/webext-permission-toggle)

<img width="331" alt="Context menu" src="https://user-images.githubusercontent.com/1402241/32874388-e0c64150-cacc-11e7-9a50-eae3727fd3c2.png" align="right">

> WebExtension module: Browser-action context menu to request permission for the current tab.

- Browsers: Chrome, Firefox, and Safari
- Manifest: v2 and v3

_This package was recently renamed from `webext-domain-permission-toggle` to `webext-permission-toggle`_

Works great when paired with [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts/blob/master/how-to-add-github-enterprise-support-to-web-extensions.md) if you want to also inject content scripts on the new hosts.

This repository even includes a [customizable guide](https://fregante.github.io/webext-permission-toggle/) to tell your users how to use it. At the bottom of that page, you'll find a link that lets you customize it with your extension’s name and icon. You can link your users to it directly, it's a permalink.

## Install

You can download the [standalone bundle](https://bundle.fregante.com/?pkg=webext-permission-toggle&global=addPermissionToggle) and include it in your `manifest.json`.

Or use `npm`:

```sh
npm install webext-permission-toggle
```

```js
import addPermissionToggle from 'webext-permission-toggle';
```

## Usage

```js
// In background.js
addPermissionToggle();
```

### manifest.json v3

```js
// example background.worker.js
navigator.importScripts(
	"webext-permission-toggle.js"
)
```
```js
{
	"version": 3,
	"action": { /* Firefox support */
		"default_icon": "icon.png"
	},
	"permissions": [
		"contextMenus",
		"activeTab",
		"scripting",
	],
	"optional_host_permissions": [
		"*://*/*"
	],
	"background": {
		"service_worker": "background.worker.js"
	}
}
```

### manifest.json v2

```js
{
	"version": 2,
	"browser_action": { /* Firefox support */
		"default_icon": "icon.png"
	},
	"permissions": [
		"contextMenus",
		"activeTab"
	],
	"optional_permissions": [
		"*://*/*"
	],
	"background": {
		"scripts": [
			"webext-permission-toggle.js",
			"background.js"
		]
	}
}
```

## API

### addPermissionToggle([options])

<img width="331" alt="Context menu" src="https://user-images.githubusercontent.com/1402241/32874388-e0c64150-cacc-11e7-9a50-eae3727fd3c2.png" align="right">

Adds an item to the browser action icon's context menu (as shown in the screenshot).

The user can access this menu by right clicking the icon. If your extension doesn't have any action or popup assigned to the icon, it will also appear with a left click.

#### options

##### title

Type: `string`

Default: `'Enable ${extensionName} on this domain'`

The title of the action in the context menu.

##### reloadOnSuccess

<img align="right" alt="Reload confirmation message" width="332" src="https://user-images.githubusercontent.com/1402241/32890310-2e503192-cb09-11e7-863c-a96df2bf838c.png">

Type: `boolean` `string`

Default: `false`

If `true` or `string`, when the user accepts the new permission, they will be asked to reload the current tab. Set a `string` to customize the message or `true` use the default message: `Do you want to reload this page to apply ${extensionName}?`

## Related

- [webext-dynamic-content-scripts](https://github.com/fregante/webext-dynamic-content-scripts) - Automatically registers your content_scripts on hosts added via `permission.request()`
- [webext-permissions](https://github.com/fregante/webext-permissions) - Get any optional permissions that users have granted you.
- [webext-options-sync](https://github.com/fregante/webext-options-sync) - Helps you manage and autosave your extension's options. Chrome and Firefox.
- [Awesome-WebExtensions](https://github.com/fregante/Awesome-WebExtensions) - A curated list of awesome resources for WebExtensions development.
- [More…](https://github.com/fregante/webext-fun)

## License

MIT © [Federico Brigante](https://fregante.com)
