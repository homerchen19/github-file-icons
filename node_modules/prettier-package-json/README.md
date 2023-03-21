# Prettier `package.json`

[![CI](https://github.com/cameronhunter/prettier-package-json/actions/workflows/ci.yml/badge.svg)](https://github.com/cameronhunter/prettier-package-json/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/prettier-package-json.svg)](https://www.npmjs.com/package/prettier-package-json)

`prettier-package-json` is a JSON formatter inspired by `prettier`. It removes all original styling and ensures that the outputted `package.json` conforms to a consistent style. By default it uses opinionated defaults but can be configured to your individual needs.

## Features

### Consistent key order

Keys in `package.json` will be sorted in an [opinionated order](src/defaultOptions.ts) but may be configured to your own preferences.

Input:

```json
{
  "description": "Prettier formatter for package.json files",
  "name": "prettier-package-json",
  "license": "MIT",
  "version": "1.0.1",
  "author": "Cameron Hunter <hello@cameronhunter.co.uk>"
}
```

Output:

```json
{
  "name": "prettier-package-json",
  "description": "Prettier formatter for package.json files",
  "author": "Cameron Hunter <hello@cameronhunter.co.uk>",
  "license": "MIT",
  "version": "1.0.1"
}
```

### Sensibly sorted scripts

The `scripts` field is sorted alphabetically but keeps `pre` and `post` scripts surrounding their named script.

Input:

```json
{
  "name": "prettier-package-json",
  "version": "1.0.1",
  "scripts": {
    "test": "test",
    "pretest": "pretest",
    "version": "version",
    "postversion": "postversion",
    "build": "build"
  }
}
```

Output:

```json
{
  "name": "prettier-package-json",
  "version": "1.0.1",
  "scripts": {
    "build": "build",
    "pretest": "pretest",
    "test": "test",
    "version": "version",
    "postversion": "postversion"
  }
}
```

### Expand/contract author, contributors, and maintainers

The `author`, `contributors` and `maintainers` fields will be shortened to their string versions and sorted by name. Use
the `--expand-users` option if you prefer user objects.

Input:

```json
{
  "name": "prettier-package-json",
  "version": "1.0.1",
  "author": {
    "name": "Cameron Hunter",
    "email": "hello@cameronhunter.co.uk",
    "url": "https://cameronhunter.co.uk"
  },
  "contributors": ["Barry", "Adam <adam@email.com>"]
}
```

Output:

```json
{
  "name": "prettier-package-json",
  "version": "1.0.1",
  "author": "Cameron Hunter <hello@cameronhunter.co.uk> (https://cameronhunter.co.uk)",
  "contributors": ["Adam <adam@email.com>", "Barry"]
}
```

### Filter and sort files field

Some files are included or excluded automatically by `npm`, these are removed from the `files` field before sorting
alphabetically.

Input:

```json
{
  "name": "prettier-package-json",
  "version": "1.0.1",
  "main": "src/index.js",
  "files": ["src/index.js", "src", "CHANGELOG.md", "readme.md", "package-lock.json"]
}
```

Output:

```json
{
  "name": "prettier-package-json",
  "version": "1.0.1",
  "main": "src/index.js",
  "files": ["src"]
}
```

## Usage

Install:

```sh
yarn add prettier-package-json --dev
```

You can install it globally if you like:

```sh
yarn global add prettier-package-json
```

_We're defaulting to yarn but you can use npm if you like:_

```sh
npm install [-g] prettier-package-json
```

### CLI

Run `prettier-package-json` through the CLI with this script. Run it without any arguments to see the options.

To format a file in-place, use `--write`. You may want to consider committing your file before doing that, just in case.

```sh
prettier-package-json [opts] [filename]
```

In practice, this may look something like:

```sh
prettier-package-json --write ./package.json
```

#### Pre-commit hook for changed files

You can use this with a pre-commit tool. This can re-format your files that are marked as "staged" via git add before you commit.

##### 1. [lint-staged](https://github.com/okonet/lint-staged)

Install it along with [husky](https://github.com/cameronhunter/husky):

```bash
yarn add lint-staged husky --dev
```

and add this config to your `package.json`:

```json
{
  "scripts": {
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "package.json": ["prettier-package-json --write", "git add"]
  }
}
```

See https://github.com/okonet/lint-staged#configuration for more details about how you can configure lint-staged.

##### 2. bash script

Alternately you can just save this script as `.git/hooks/pre-commit` and give it execute permission:

```bash
#!/bin/sh
packagejsonfiles=$(git diff --cached --name-only --diff-filter=ACM | grep 'package\.json$' | tr '\n' ' ')
[ -z "$packagejsonfiles" ] && exit 0

diffs=$(node_modules/.bin/prettier-package-json -l $packagejsonfiles)
[ -z "$diffs" ] && exit 0

echo "here"
echo >&2 "package.json files must be formatted with prettier-package-json. Please run:"
echo >&2 "node_modules/.bin/prettier-package-json --write "$diffs""

exit 1
```

### API

The API has two functions, exported as `format` and `check`. Usage is as follows:

```js
import { format, check } from 'prettier-package-json';

const options = {}; // optional

format(json, options);
check(json, options);
```

`check` checks to see if the file has been formatted with `prettier-package-json` given those options and returns a Boolean.
This is similar to the `--list-different` parameter in the CLI and is useful for running in CI scenarios.

### CI

For usage in CI scenarios, you can use the `--list-different` CLI flag. The command will list all invalid files and return
with a proper default error code, so that in case of an error or invalid file the build pipeline automatically fails.

These are the status codes:

- `0`: all files valid, no error occured.
- `1`: an error ocurred, for example a JSON parse error. See message on `stderr` for details.
- `2`: not all files are valid.

These exit codes are only set when in `--list-different` mode.

### Options

`prettier-package-json` ships with a handful of customizable format options, usable in both the CLI, API, and configuration file.

| Option                                                              | Default                                                                                                         | CLI override                            | API override                  |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------- |
| **Tab Width** - Specify the number of spaces per indentation-level. | `2`                                                                                                             | `--tab-width <int>`                     | `tabWidth: <int>`             |
| **Tabs** - Indent lines with tabs instead of spaces.                | `false`                                                                                                         | `--use-tabs`                            | `useTabs: <bool>`             |
| **Expand Users** - Expand author and contributors into objects.     | `false`                                                                                                         | `--expand-users`                        | `expandUsers: <bool>`         |
| **Key Order** - Specify the order of keys.                          | See [default options](src/defaultOptions.ts) | `--key-order <comma,separated,list...>` | `keyOrder: <array\|function>` |

A configuration file will be searched for using [`cosmiconfig`](https://www.npmjs.com/package/cosmiconfig) rules:

- `prettier-package-json` field in `package.json`.
- `prettier-package-json` file (JSON or YAML), extentionless "rc" file.
- `prettier-package-json` file with the extensions `.json`, `.yaml`, `.yml`, `.js`, or `.cjs`.
- `prettier-package-json.config.js` or `prettier-package-json.config.cjs` CommonJS module.

Configuration file may also be passed using the `--config` CLI parameter.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
