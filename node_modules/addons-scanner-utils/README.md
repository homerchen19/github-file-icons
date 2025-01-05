# addons-scanner-utils

[![CircleCI](https://circleci.com/gh/mozilla/addons-scanner-utils.svg?style=svg)](https://circleci.com/gh/mozilla/addons-scanner-utils) [![codecov](https://codecov.io/gh/mozilla/addons-scanner-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/mozilla/addons-scanner-utils) [![npm version](https://badge.fury.io/js/addons-scanner-utils.svg)](https://badge.fury.io/js/addons-scanner-utils)

Various addons related helpers to build scanners.

## Usage

```
yarn add addons-scanner-utils
```

## Requirements

- You need [Node](https://nodejs.org/) 16, which is the current [LTS](https://github.com/nodejs/LTS) (long term support) release.
- You need [yarn](https://yarnpkg.com/en/) to manage dependencies and run commands.

## Development

- Read [our contributing guidelines](./CONTRIBUTING.md) to get started on your first patch
- Clone this repository
- Type `yarn` to install everything
- Run the test suite to make sure everything is set up: `yarn test`

### Available development commands

In the project directory, you can run the following commands. There are a few commands not mentioned here (see `package.json`) but those are only used by internal processes.

#### `yarn eslint`

This runs [ESLint][] to discover problems within our codebase without executing it. ESLint also enforces some patterns and practices.

#### `yarn lint`

This runs all the _lint_ commands at once.

#### `yarn prettier`

This runs [Prettier][] to automatically format the entire codebase.

#### `yarn prettier-dev`

This runs [Prettier][] on only your changed files. This is intended for development.

#### `yarn test`

This launches [Jest][] in the interactive watch mode.

### Prettier

We use [Prettier][] to automatically format our JavaScript code and stop all the on-going debates over styles. As a developer, you have to run it (with `yarn prettier-dev`) before submitting a Pull Request.

### Versioning

This project follows the [semantic versioning](https://semver.org/) specification.

In order to release a new version, one has to run the [`npm version`](https://docs.npmjs.com/cli/version) command with one of the following arguments: `minor`, `patch` or `major` (less frequent). This command (1) updates the `version` in `package.json`, (2) create a new commit for the release and (3) make a `git` tag.

[eslint]: https://eslint.org/
[jest]: https://jestjs.io/
[prettier]: https://prettier.io/
