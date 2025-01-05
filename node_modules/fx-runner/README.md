# Firefox Runner

[![CircleCI](https://circleci.com/gh/mozilla/node-fx-runner.svg?style=svg)](https://circleci.com/gh/mozilla/node-fx-runner)
[![npm version](https://badge.fury.io/js/fx-runner.svg)](https://badge.fury.io/js/fx-runner)

## API

```
Usage: fx-runner [options] [command]

Commands:

start Start Firefox

Options:

-h, --help               output usage information
-V, --version            output the version number
-b, --binary <path>      Path of Firefox binary to use.
--binary-args <CMDARGS>  Pass additional arguments into Firefox.
-p, --profile <path>     Path or name of Firefox profile to use.
-v, --verbose            More verbose logging to stdout.
--new-instance           Use a new instance
--no-remote              Do not allow remote calls
--foreground             Bring Firefox to the foreground
-l, --listen <port>      Start the debugger server on a specific port.
```

### Releasing

To create a new release, do the following:

* Pull from master to make sure you're up to date.
* Bump the version in `package.json`.
* Commit and push the version change
  (or create and merge a pull request for it).
* Create a [new release](https://github.com/mozilla/fx-runner/releases/new)
  and paste in a changelog in Markdown format.
  Title the github release after the new version you just
  added in the previous commit to `package.json` (example: `1.0.4`).
* When you publish the release, github creates a tag.
  When TravisCI builds the tag,
  it will automatically publish the package to
  [npm](https://www.npmjs.com/package/fx-runner).
