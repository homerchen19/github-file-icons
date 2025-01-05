[![CircleCI](https://circleci.com/gh/mozilla/addons-linter.svg?style=svg)](https://circleci.com/gh/mozilla/addons-linter) [![codecov](https://codecov.io/gh/mozilla/addons-linter/branch/master/graph/badge.svg)](https://codecov.io/gh/mozilla/addons-linter) [![npm version](https://badge.fury.io/js/addons-linter.svg)](https://badge.fury.io/js/addons-linter)

# addons-linter

The Add-ons Linter is being used by [web-ext](https://github.com/mozilla/web-ext/) and [addons.mozilla.org](https://github.com/mozilla/addons-server/) to lint [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).

It can also be used as a standalone binary and library.

You can find more information about the linter and it's implemented rules in our [documentation](https://mozilla.github.io/addons-linter/).

## Usage

### Command Line

You need Node.js to use the add-ons linter.

To validate your add-on locally, install the linter from [npm](http://nodejs.org/):

```sh
# Install globally so you can use the linter from any directory on
# your machine.
npm install -g addons-linter
```

After installation, run the linter and direct it to your add-on file:

```sh
addons-linter my-addon.zip
```

Alternatively you can point it at a directory:

```sh
addons-linter my-addon/src/
```

The addons-linter will check your add-on and show you errors, warnings, and friendly messages for your add-on. If you want more info on the options you can enable/disable for the command-line app, use the `--help` option:

```sh
addons-linter --help
```

#### Privileged extensions

The addons-linter can lint privileged extensions **only** when the `--privileged` option is passed to it. This option changes the behavior of the linter to:

1. emit errors when the input file (or directory) is a regular extension (i.e. the extension does not use privileged features)
2. hide messages related to privileged features (e.g., permissions and properties) when the input file (or directory) is a privileged extension

### Linter API Usage

You can use the linter directly as a library to integrate it better into your development process.

```js
import linter from 'addons-linter';

const sourceDir = process.cwd();

const linter = linter.createInstance({
  config: {
    // This mimics the first command line argument from yargs,
    // which should be the directory to the extension.
    _: [sourceDir],
    logLevel: process.env.VERBOSE ? 'debug' : 'fatal',
    stack: Boolean(process.env.VERBOSE),
    pretty: false,
    warningsAsErrors: false,
    metadata: false,
    output: 'none',
    boring: false,
    selfHosted: false,
    // Lint only the selected files
    //   scanFile: ['path/...', ...]
    //
    // Exclude files:
    shouldScanFile: (fileName) => true,
  },
  // This prevent the linter to exit the nodejs application
  runAsBinary: false,
});

linter.run()
  .then((linterResults) => ...)
  .catch((err) => console.error("addons-linter failure: ", err));
```

`linter.output` is composed by the following properties (the same of the 'json' report type):

```js
{
  metadata: {...},
  summary: {
    error, notice, warning,
  },
  scanFile,
  count,
  error: [{
    type: "error",
    code, message, description,
    column, file, line
  }, ...],
  warning: [...],
  notice: [...]
}
```

## Development

If you'd like to help us develop the addons-linter, that's great! It's pretty easy to get started, you just need Node.js installed on your machine.

### Quick Start

If you have Node.js installed, here's the quick start to getting your development dependencies installed and running the tests

```sh
git clone https://github.com/mozilla/addons-linter.git
cd addons-linter
npm install
# Build the project.
npm run build
# Run the test-suite and watch for changes. Use `npm run test-once` to
# just run it once.
npm run test
```

You can also build the addons-linter binary to test your changes.

```sh
npm run build
# Now run it against your add-on. Please note that for every change
# in the linter itself you'll have to re-build the linter.
bin/addons-linter my-addon.zip
```

### Required Node version

addons-linter requires Node.js v16 or greater. Have a look at our `.circleci/config.yml` file which Node.js versions we officially test.

Using nvm is probably the easiest way to manage multiple Node versions side by side. See [nvm on GitHub](https://github.com/creationix/nvm) for more details.

### Install dependencies

Install dependencies with npm:

```sh
npm install
```

#### npm scripts

| Script                          | Description                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------- |
| npm test                        | Runs the tests (watches for changes)                                             |
| npm [run] build                 | Builds the lib (used by CI)                                                      |
| npm run test-coverage           | Runs the tests with coverage (watches for changes)                               |
| npm run test-once               | Runs the tests once                                                              |
| npm run lint                    | Runs ESLint                                                                      |
| npm run test-coverage-once      | Runs the tests once with coverage                                                |
| npm run test-integration-linter | Runs our integration test-suite                                                  |
| npm run prettier                | Automatically format the whole code-base with Prettier                           |
| npm run prettier-ci             | Run [Prettier][] and fail if some code has been changed without being formatted  |
| npm run prettier-dev            | Automatically compare and format modified source files against the master branch |

### Building

You can run `npm run build` to build the library.

Once you build the library you can use the CLI in `bin/addons-linter`.

### Testing

Run `npm test`. This will watch for file-changes and re-runs the test suite.

#### Coverage

We're looking to maintain coverage at 100%. Use the coverage data in the test output to work out what lines aren't covered and ensure they're covered.

#### Assertions and testing APIs

We are using using Sinon for assertions, mocks, stubs and more [see the Sinon docs for the API available](http://sinonjs.org/).

[Jest](https://facebook.github.io/jest/) is being used as a test-runner but also provides helpful tools. Please make sure you read their documentation for more details.

### Logging

We use [pino](https://github.com/pinojs/pino) for logging:

- By default logging is off (level is set to 'fatal') .
- Logging in tests can be enabled using an env var e.g: `LOG_LEVEL=debug jest test`
- Logging on the CLI can be enabled with `--log-level [level]`.

### Prettier

We use [Prettier](https://prettier.io/) to automatically format our JavaScript code and stop all the on-going debates over styles. As a developer, you have to run it (with `npm run prettier-dev`) before submitting a Pull Request.

### L10n extraction

The localization process is very similar to [how we do it for addons-frontend](https://addons-frontend.readthedocs.io/en/latest/i18n/#updating-locales): locales are always updated on the `master` branch, any PR that changes or introduces new localized strings should be merged on `master` first.

In order to update the locales (when new localized strings are added to the codebase), run the following script from the `master` branch. This script automates _all_ the steps described in the addons-frontend docs, without any confirmation step.

```
./scripts/run-l10n-extraction
```

## Architecture

In a nutshell the way the linter works is to take an add-on package, extract the metadata from the xpi (zip) format and then process the files it finds through various content scanners.

We are heavily relying on [ESLint](https://eslint.org/) for JavaScript linting, [cheerio](https://github.com/cheeriojs/cheerio) for HTML parsing as well as [fluent.js](https://github.com/projectfluent/fluent.js) for parsing language packs.

### Scanners

Each file-type has a scanner. For example: CSS files use `CSSScanner`; JavaScript files use `JavaScriptScanner`. Each scanner looks at relevant files and passes each file through a parser which then hands off to a set of rules that look for specific things.

### Rules

Rules get exported via a single function in a single file. A rule can have private functions it uses internally, but rule code should not depend on another rule file and each rule file should export one rule.

Each rule function is passed data from the scanner in order to carry out the specific checks for that rule it returns a list of objects which are then made into message objects and are passed to the Collector.

### Collector

The Collector is an in-memory store for all validation message objects "collected" as the contents of the package are processed.

### Messages

Each message has a code which is also its key. It has a message which is a short outline of what the message represents, and a description which is more detail into why that message was logged. The type of the message is set as messages are added so that if necessary the same message could be an error _or_ a warning for example.

### Output

Lastly when the processing is complete the linter will output the collected data as text or JSON.

## Deploys

We deploy to npm automatically using Circle CI. To release a new version, increment the version in `package.json` and create a PR. Make sure your version number conforms to the [semver][] format eg: `0.2.1`.

After merging the PR, [create a new release][new release] with the same tag name as your new version. Once the build passes it will deploy. Magic! ✨

## Dispensary

As of November 2021, [dispensary](https://github.com/mozilla/dispensary) has been merged into this project and a CLI is available by running `./scripts/dispensary`.

### Libraries updates

This is the (manual) process to update the "dispensary" libraries:

1. Open `src/dispensary/libraries.json`
2. Open the release pages of each library. Here is a list:

<!--RELEASE_PAGES_START-->

- https://github.com/angular/angular.js/releases
- https://github.com/jashkenas/backbone/releases
- https://github.com/twbs/bootstrap/releases
- https://download.dojotoolkit.org/
- https://github.com/cure53/DOMPurify/releases
- https://github.com/jquery/jquery/releases
- https://github.com/jquery/jquery-ui/releases
- https://github.com/moment/moment/releases
- https://github.com/mootools/mootools-core/releases
- http://prototypejs.org/
- https://github.com/facebook/react/releases
- https://github.com/jashkenas/underscore/releases
- https://github.com/mozilla/webextension-polyfill/releases

<!--RELEASE_PAGES_END-->

3. On each page, check whether there are newer release versions than what is in `src/dispensary/libraries.json`. Note that some libraries, like react, support several versions, so we need to check each "branch".
4. For major upgrades, take a quick look at the code changes
5. Add new versions to `src/dispensary/libraries.json`
6. Run `npm run update-hashes`
7. Commit the changes in `src/dispensary/libraries.json`and `src/dispensary/hashes.txt`
8. Open a Pull Request

Note: `hashes.txt` will be embedded into the addons-linter bundle.

The `scripts/update-dispensary-doc` command updates the list of release pages above based on the `src/dispensary/libraries.json` file.

## License

This source code is available under the [Mozilla Public License 2.0](LICENSE).

Additionally, parts of the schema files originated from Chromium source code:

> Copyright (c) 2012 The Chromium Authors. All rights reserved.
> Use of this source code is governed by a BSD-style license that can be
> found in the [LICENSE-CHROMIUM](src/schema/imported/LICENSE-CHROMIUM) file.

You are not granted rights or licenses to the trademarks of the
Mozilla Foundation or any party, including without limitation the
Firefox name or logo.

For more information, see: https://www.mozilla.org/foundation/licensing.html

[new release]: https://github.com/mozilla/addons-linter/releases/new
[semver]: http://semver.org/
[prettier]: https://prettier.io/
