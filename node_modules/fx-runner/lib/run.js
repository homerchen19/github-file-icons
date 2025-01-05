/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var spawn = require("child_process").spawn;
var normalizeBinary = require("./utils").normalizeBinary;
var parse = require("shell-quote").parse;

/**
 * Takes a manifest object (from package.json) and options,
 * and runs Firefox.
 *
 * @param {Object} options
 *   - `binary` path to Firefox binary to use
 *   - `profile` path to profile or profile name to use
 *   - `binary-args-first` put the binary arguments first in the list of
 *     command arguments. This is mainly useful to be able to run binaries via
 *     third-party tools, e.g. `flatpak run org.mozilla.firefox`.
 * @return {Object} results
 */
function runFirefox (options) {
  const env = Object.assign({}, process.env, options.env || {});
  const args = buildArgs(options || {});

  return normalizeBinary(options.binary).then(function(binary) {
    // Using `spawn` so we can stream logging as they come in, rather than
    // buffer them up until the end, which can easily hit the max buffer size.
    var firefox = spawn(binary, args, { env: env });

    firefox.on("close", function () {
      process.removeListener("exit", killFirefox);
    });

    function killFirefox () {
      firefox.kill();
    }

    // Kill child process when main process is killed
    process.once("exit", killFirefox);

    return {
      process: firefox,
      binary: binary,
      args: args
    };
  });
}
module.exports = runFirefox;

// profiles that do not include "/" are treated
// as profile names to be used by the firefox profile manager
function isProfileName (profile) {
  if (!profile) {
    return false;
  }
  return !/[\\\/]/.test(profile);
}

function buildArgs(options) {
  let args = [];

  const profilePath = options.profile;

  if (profilePath) {
    if (isProfileName(profilePath)) {
      args.unshift("-P", profilePath);
    }
    else {
      args.unshift("-profile", profilePath);
    }
  }

  if (options["new-instance"]) {
    args.unshift("-new-instance");
  }

  if (options["no-remote"]) {
    args.unshift("-no-remote");
  }

  if (options["foreground"]) {
    args.unshift("-foreground");
  }

  // support for starting the remote debugger server
  if (options["listen"]) {
    args.unshift(options.listen);
    args.unshift("-start-debugger-server");
  }

  if (options["binary-args"]) {
    const binaryArgs = Array.isArray(options["binary-args"]) ?
      options["binary-args"] : parse(options["binary-args"]);

    if (options["binary-args-first"]) {
      args = binaryArgs.concat(args);
    } else {
      args = args.concat(binaryArgs);
    }
  }

  return args;
}
module.exports.buildArgs = buildArgs;
