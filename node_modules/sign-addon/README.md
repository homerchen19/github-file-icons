# Sign Add-on

Sign a Firefox add-on with Mozilla's [web service](http://addons-server.readthedocs.org/en/latest/topics/api/signing.html).

[![CircleCI](https://circleci.com/gh/mozilla/sign-addon.svg?style=svg)](https://circleci.com/gh/mozilla/sign-addon) [![npm version](https://badge.fury.io/js/sign-addon.svg)](https://badge.fury.io/js/sign-addon) [![codecov](https://codecov.io/gh/mozilla/sign-addon/branch/master/graph/badge.svg)](https://codecov.io/gh/mozilla/sign-addon)

## Installation

    npm install sign-addon

## Getting started

To sign add-ons, you first need to generate API credentials, a JWT issuer and secret, from the [AMO Developer Hub](https://addons.mozilla.org/en-US/developers/addon/api/key/).

Currently, this is intended for use in [NodeJS](https://nodejs.org/) only and should work in version 10 or higher.

## Programmatic use

Here is how to retrieve a signed version of an [XPI file](https://developer.mozilla.org/en-US/docs/Mozilla/XPI):

```javascript
import { signAddon } from 'sign-addon';

signAddon({
  // Required arguments:

  xpiPath: '/path/to/your/addon.xpi',
  version: '0.0.1',
  apiKey: 'Your JWT issuer',
  apiSecret: 'Your JWT secret',

  // Optional arguments:

  // The explicit extension ID.
  // WebExtensions do not require an ID.
  // See the notes below about dealing with IDs.
  id: 'your-addon-id@somewhere',
  // The release channel (listed or unlisted).
  // Ignored for new add-ons, which are always unlisted.
  // Default: most recently used channel.
  channel: undefined,
  // Save downloaded files to this directory.
  // Default: current working directory.
  downloadDir: undefined,
  // Number of milliseconds to wait before aborting the request.
  // Default: 15 minutes.
  timeout: undefined,
  // Optional proxy to use for all API requests,
  // such as "http://yourproxy:6000"
  // Read this for details on how proxy requests work:
  // https://github.com/request/request#proxies
  apiProxy: undefined,
  // Optional object to pass to request() for additional configuration.
  // Some properties such as 'url' cannot be defined here.
  // Available options:
  // https://github.com/request/request#requestoptions-callback
  apiRequestConfig: undefined,
  // Optional override to the number of seconds until the JWT token for
  // the API request expires. This must match the expiration time that
  // the API server accepts.
  apiJwtExpiresIn: undefined,
  // Optional override to the URL prefix of the signing API.
  // The production instance of the API will be used by default.
  apiUrlPrefix: 'https://addons.mozilla.org/api/v4',
})
  .then(function (result) {
    if (result.success) {
      console.log('The following signed files were downloaded:');
      console.log(result.downloadedFiles);
      console.log('Your extension ID is:');
      console.log(result.id);
    } else {
      console.error('Your add-on could not be signed!');
      console.error('Error code: ' + result.errorCode);
      console.error('Details: ' + result.errorDetails);
    }
    console.log(result.success ? 'SUCCESS' : 'FAIL');
  })
  .catch(function (error) {
    console.error('Signing error:', error);
  });
```

## Dealing With Extension IDs

Here are some notes about dealing with IDs when using `signAddon()`:

- [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) do not require you to pass `id` to `signAddon()`. In this case, an ID will be auto-generated for you. It is accessible in `signingResult.id`.
- If a WebExtension's `manifest.json` already declares an ID, any `id` you pass to `signAddon()` will have no effect!
- To push an updated version to a WebExtension that had its ID auto-generated, you need to pass in the original ID explicitly.
- You must pass `id` to `signAddon()` for all other non-WebExtension add-ons.

## Development

Here's how to set up a development environment for the `sign-addon` package. Install all requirements and run tests from the source:

```
$ npm install
$ npm test
```

### Prettier

We use [Prettier][] to automatically format our JavaScript code and stop all the on-going debates over styles. As a developer, you have to run it (with `npm run prettier-dev`) before submitting a Pull Request.

### Useful commands

In the project directory, you can run the following commands. There are a few commands not mentioned here (see `package.json`) but those are only used by internal processes.

#### `npm run build`

This packages the library for production into the `dist/` folder.

#### `npm run changelog`

This creates a changelog of all unreleased changes (in markdown). See the [Releasing](#releasing) section for more information.

### `npm run changelog-lint`

This lints the commit messages. See the [Writing commit messages](#writing-commit-messages) section for more information.

#### `npm run eslint`

This runs [ESLint][] to discover problems within our codebase without executing it. ESLint also enforces some patterns and practices.

#### `npm run lint`

This runs all the _lint_ commands at once.

#### `npm run prettier`

This runs [Prettier][] to automatically format the entire codebase.

#### `npm run prettier-dev`

This runs [Prettier][] on only your changed files. This is intended for development.

#### `npm test`

This runs the test suite.

You can run this command in "watch mode" while working on this project:

```
$ npm test -- --watch
```

#### `npm run typecheck`

This checks for [TypeScript][] errors in all files, including test files.

You can run this command in "watch mode" while working on this project:

```
$ npm run typecheck -- --watch
```

### Linking

The `sign-addon` module is meant to be used as a dependency. If you need to test your local code inside another module, you can link it.

First, link it your npm system:

    cd /path/to/sign-addon
    npm link

Next, change into the module you want to use it in, citing [web-ext](https://github.com/mozilla/web-ext) as an example, and link back to `sign-addon`:

    cd /path/to/web-ext
    npm link sign-addon

`web-ext` will now use your local version of `sign-addon`.

### Writing commit messages

We follow the Angular style of [semantic messages](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit) when writing a commit message. This allows us to auto-generate a changelog without too much noise in it. Be sure to write the commit message in past tense so it will read naturally as a historic changelog.

Examples:

- `feat: Added a systematic dysfunctioner`
- `fix: Fixed hang in systematic dysfunctioner`
- `docs: Improved contributor docs`
- `style: Added no-console linting, cleaned up code`
- `refactor: Split out dysfunctioner for testability`
- `perf: Systematic dysfunctioner is now 2x faster`
- `test: Added more tests for systematic dysfunctioner`
- `chore: Upgraded yargs to 3.x.x`

If you want to use scopes then it would look more like: `feat(dysfunctioner): Added --quiet option`.

You can check if the commit message on your branch is formatted correctly by running this:

    npm run changelog-lint

### Releasing

To create a new release, do the following:

- Pull from master to make sure you're up to date.
- Bump the version in `package.json`.
- Commit and push the version change (or create and merge a pull request for it).
- Create a changelog by running `npm run changelog`. This will output Markdown of all unreleased changes.
- Create a [new release](https://github.com/mozilla/sign-addon/releases/new) and paste in the changelog Markdown. It may require some manual editing. For example, some commit messages might have been truncated. Title the github release after the new version you just added in the previous commit to `package.json` (example: `1.0.4`).
- When you publish the release, github creates a tag. When TravisCI builds the tag, it will automatically publish the package to [npm](https://www.npmjs.com/package/sign-addon).

[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[typescript]: https://www.typescriptlang.org/
