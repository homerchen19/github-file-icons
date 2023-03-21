# Webpack Extension Reloader

A Webpack plugin to automatically reload browser extensions during development.

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <br>
  <br>
</div>
  
[![npm version](https://img.shields.io/npm/v/webpack-ext-reloader)](https://www.npmjs.com/package/webpack-ext-reloader)
[![Test Status](https://github.com/SimplifyJobs/webpack-ext-reloader/workflows/tests/badge.svg)](https://github.com/SimplifyJobs/webpack-ext-reloader/actions?query=branch%3Amaster)
[![Known Vulnerabilities](https://snyk.io/test/github/SimplifyJobs/webpack-ext-reloader/badge.svg)](https://snyk.io/test/github/SimplifyJobs/webpack-ext-reloader/)
[![NPM Downloads](https://img.shields.io/npm/dt/webpack-ext-reloader.svg)](https://www.npmjs.com/package/webpack-ext-reloader)

## Installing

npm

```bash
npm install webpack-ext-reloader --save-dev
```

yarn

```bash
yarn add webpack-ext-reloader --dev
```

## What is this?

This is a webpack plugin that allows you to bring hot reloading functionality to WebExtensions, essentially `webpack-dev-server`, but for WebExtensions.

This is a fork from [`webpack-extension-reloader`](https://github.com/rubenspgcavalcante/webpack-extension-reloader), maintained and updated by the team here at Simplify. The goal here is to continue to support the latest version of webpack (`webpack-extension-reloader` only supports webpack v4) while adding new improvements (i.e. HMR).

![](.github/sample-gif.gif)

**Note**: This plugin doesn't support [**Hot Module Replacement (HMR)**](https://webpack.js.org/concepts/hot-module-replacement/) yet.

## How to use

### Using as a plugin

Add `webpack-ext-reloader` to the plugins section of your webpack configuration file. Note that this plugin don't outputs the manifest (at most read it to gather information).
For outputing not only the `manifest.json` but other static files too, use `CopyWebpackPlugin`.

```js
const ExtReloader  = require('webpack-ext-reloader');

plugins: [
  new ExtReloader(),
  new CopyWebpackPlugin([
      { from: "./src/manifest.json" },
      { from: "./src/popup.html" },
    ]),
]
```

You can point to your `manifest.json file`...

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
  //...
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

**Note I**: `entry` or `manifest` are needed. If both are given, entry will override the information comming from `manifest.json`. If none are given the default `entry` values (see above) are used.

And then just run your application with Webpack in watch mode:

```bash
NODE_ENV=development webpack --config myconfig.js --mode=development --watch 
```

**Note II**: You need to set `--mode=development` to activate the plugin (only if you didn't set on the webpack.config.js already) then you need to run with `--watch`, as the plugin will be able to sign the extension only if webpack triggers the rebuild (again, only if you didn't set on webpack.config).

### Multiple Content Script and Extension Page support

If you use more than one content script or extension page in your extension, like:

```js
entry: {
  'my-first-content-script': './my-first-content-script.js',
  'my-second-content-script': './my-second-content-script.js',
  // and so on ...
  background: './my-background-script.js',
  'popup': './popup.js',
  'options': './options.js',
  // and so on ...
}
```

You can use the `entries.contentScript` or `entries.extensionPage` options as an array:

```js
plugins: [
  new ExtReloader({
    entries: { 
      contentScript: ['my-first-content-script', 'my-second-content-script', /* and so on ... */],
      background: 'background',
      extensionPage: ['popup', 'options', /* and so on ... */],
    }
  }),
  // ...
]
```

### CLI

If you don't want all the plugin setup, you can just use the client that comes with the package.  
You can use by installing the package globally, or directly using `npx`:

```bash
npx webpack-ext-reloader
```

If you run directly, it will use the  default configurations, but if you want to customize
you can call it with the following options:

```bash
npx webpack-ext-reloader --config wb.config.js --port 9080 --no-page-reload --content-script my-content.js --background bg.js --extension-page popup.js
```

If you have **multiple** content scripts or extension pages, just use comma (with no spaces) while passing the option

```bash
npx webpack-ext-reloader --content-script my-first-content.js,my-second-content.js,my-third-content.js --extension-page popup.js,options.js
```

### Client options

| name             | default           | description                                                       |
| ---------------- | ----------------- | ----------------------------------------------------------------- |
| --help           |                   | Shows this help                                                   |
| --config         | webpack.config.js | The webpack configuration file path                               |
| --port           | 9090              | The port to run the server                                        |
| --manifest       |                   | The path to the extension **manifest.json** file                  |
| --content-script | content-script    | The **entry/entries** name(s) for the content script(s)           |
| --background     | background        | The **entry** name for the background script                      |
| --extension-page | popup             | The **entry/entries** name(s) for the extension pages(s)          |
| --no-page-reload |                   | Disable the auto reloading of all **pages** which runs the plugin |

Every time content or background scripts are modified, the extension is reloaded :)  
**Note:** the plugin only works on **development** mode, so don't forget to set the NODE_ENV before run the command above

### Contributing

Please before opening any **issue** or **pull request** check the [contribution guide](/.github/CONTRIBUTING.MD).

### License

This project has been forked from [rubenspgcavalcante/webpack-extension-reloader](https://github.com/rubenspgcavalcante/webpack-extension-reloader), which is licensed under the [MIT license](https://github.com/rubenspgcavalcante/webpack-extension-reloader/blob/master/LICENSE). All changes made in this fork have been licensed via the [MIT license](https://github.com/SimplifyJobs/webpack-ext-reloader/blob/master/LICENSE).
