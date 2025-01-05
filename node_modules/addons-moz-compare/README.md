# addons-moz-compare

[![CircleCI](https://circleci.com/gh/mozilla/addons-moz-compare.svg?style=svg)](https://circleci.com/gh/mozilla/addons-moz-compare) [![npm version](https://badge.fury.io/js/addons-moz-compare.svg)](https://www.npmjs.com/package/addons-moz-compare)

A JavaScript library to compare Mozilla add-on versions that follow the [Manifest Version Format](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version/format).

## API

This library exposes a `mozCompare()` function that takes two (string) versions `A` and `B` and returns:

- `-1` if `A < B`
- `0` if `A == B`
- `1` if `A > B`

This implementation matches the Firefox implementation except that there are only 3 different possible return values (Firefox returns strictly negative and strictly positive values instead of `-1` and `1`).

## Usage

```
npm i addons-moz-compare
```

or

```
yarn add addons-moz-compare
```

### Node

```
const { mozCompare } = require('addons-moz-compare');
```

### Browser

Use `window.mozCompare` after having included the source of this library.

## License

This plugin is released under the Mozilla Public License Version 2.0. See the bundled [LICENSE](./LICENSE.txt) file for details.
