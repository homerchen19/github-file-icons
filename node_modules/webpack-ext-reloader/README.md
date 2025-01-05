# Webpack Extension Reloader

A Webpack plugin to automatically reload browser extensions during development.

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <br>
  <br>

[![npm version](https://img.shields.io/npm/v/webpack-ext-reloader)](https://www.npmjs.com/package/webpack-ext-reloader)
[![Test Status](https://github.com/SimplifyJobs/webpack-ext-reloader/workflows/tests/badge.svg)](https://github.com/SimplifyJobs/webpack-ext-reloader/actions?query=branch%3Amaster)
[![Known Vulnerabilities](https://snyk.io/test/github/SimplifyJobs/webpack-ext-reloader/badge.svg)](https://snyk.io/test/github/SimplifyJobs/webpack-ext-reloader/)
[![NPM Downloads](https://img.shields.io/npm/dt/webpack-ext-reloader.svg)](https://www.npmjs.com/package/webpack-ext-reloader)

</div>

## Installing

For npm:

```bash
npm install webpack-ext-reloader --save-dev
```

For yarn:

```bash
yarn add webpack-ext-reloader --dev
```

## What is this?

This is a webpack plugin that brings hot reloading functionality to WebExtensions, essentially resembling `webpack-dev-server` but for [WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions).

This project is a fork of [`webpack-extension-reloader`](https://github.com/rubenspgcavalcante/webpack-extension-reloader), maintained and updated by the team at Simplify. The goal is to continue supporting the latest version of webpack (`webpack-extension-reloader` only supports webpack v4) while introducing new improvements, such as HMR.

![](.github/sample-gif.gif)

**Note**: This plugin does not support [**Hot Module Replacement (HMR)**](https://webpack.js.org/concepts/hot-module-replacement/) yet.

## How to use

### Using as a plugin

Add `webpack-ext-reloader` to the plugins section of your webpack configuration file. This plugin does not output the manifest; it might read it for information at most. For outputting not only the `manifest.json` but other static files as well, use `CopyWebpackPlugin`.

```js
const ExtReloader = require('webpack-ext-reloader');

plugins: [
  new ExtReloader(),
  new CopyWebpackPlugin([
      { from: "./src/manifest.json" },
      { from: "./src/popup.html" },
    ]),
]
```

You can point to your `manifest.json` file...

```js
plugins: [
  new ExtReloader({
    manifest: path.resolve(__dirname, "manifest.json")
  }),
  // ...
]
```

... or you can also use some extra options (the following are the default ones):

```js
// webpack.dev.js
module.exports = {
  mode: "development", // The plugin is activated only if mode is set to development
  watch: true,
  entry: {
    'content-script': './my-content-script.js',
    background: './my-background-script.js',
    popup: 'popup',
  },
  // ...
  plugins: [
    new ExtReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: { // The entries used for the content/background scripts or extension pages
        contentScript: 'content-script',
        background: 'background',
        extensionPage: 'popup',
      }
    }),
    // ...
  ]
}
```

**Note I**: Either `entry` or `manifest` is needed. If both are provided, the `entry` will override the information from `manifest.json`. If neither is provided, the default `entry` values (as shown above) are used.

Run your application with Webpack in watch mode:

```bash
NODE_ENV=development webpack --config myconfig.js --mode=development --watch 
```

**Note II**: You need to set `--mode=development` to activate the plugin. If you didn't set it in the webpack.config.js already, you need to run with `--watch` since the plugin will be able to sign the extension only if webpack triggers the rebuild.

### Multiple Content Script and Extension Page support

If your extension uses more than one content script or extension page, like:

```js
entry: {
  'my-first-content-script': './my-first-content-script.js',
  'my-second-content-script': './my-second-content-script.js',
  background: './my-background-script.js',
  'popup': './popup.js',
  'options': './options.js',
}
```

Use the `entries.contentScript` or `entries.extensionPage` options as an array:

```js
plugins: [
  new ExtReloader({
    entries: { 
      contentScript: ['my-first-content-script', 'my-second-content-script'],
      background: 'background',
      extensionPage: ['popup', 'options'],
    }
  }),
]
```

### CLI

If you'd rather skip the plugin setup, you can use the client included with the package. Install the package globally or use `npx`:

```bash
npx webpack-ext-reloader
```

If run directly, it will use the default configurations. But if you'd like customization:

```bash
npx webpack-ext-reloader --config wb.config.js --port 9080 --no-page-reload --content-script my-content.js --background bg.js --extension-page popup.js
```

For **multiple** content scripts or extension pages, separate the options with commas (without spaces):

```bash
npx webpack-ext-reloader --content-script my-first-content.js,my-second-content.js --extension-page popup.js,options.js
```

### Client options

| Name              | Default           | Description                                                       |
| ----------------- | ----------------- | ----------------------------------------------------------------- |
| --help            |                   | Shows help                                                        |
| --config          | webpack.config.js | Path to the webpack configuration file                            |
| --port            | 9090              | Port to run the server on                                         |
| --manifest        |                   | Path to the extension's **manifest.json** file                    |
| --content-script  | content-script    | **Entry/entries** name(s) for the content script(s)               |
| --background      | background        | **Entry** name for the background script                          |
| --extension-page  | popup             | **Entry/entries** name(s) for the extension page(s)               |
| --no-page-reload  |                   | Disable auto-reloading of all **pages** running the plugin        |

Whenever content or background scripts are modified, the extension will reload.  
**Note**: This plugin only works in **development** mode. Remember to set the NODE_ENV before running the commands above.

### Contributing

Before opening any **issue** or **pull request**, please refer to the [contribution guide](/.github/CONTRIBUTING.MD).

### License

This project is a fork from [rubenspgcavalcante/webpack-extension-reloader](https://github.com/rubenspgcavalcante/webpack-extension-reloader), which is licensed under the [MIT license](https://github.com/rubenspgcavalcante/webpack-extension-reloader/blob/master/LICENSE). All modifications made in this fork are also licensed under the [MIT license](https://github.com/SimplifyJobs/webpack-ext-reloader/blob/master/LICENSE).
