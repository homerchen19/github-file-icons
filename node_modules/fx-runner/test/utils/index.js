/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var path = require("path");
var cp = require("child_process");

var fxRunner = path.join(__dirname, "../../bin/fx-runner");

function exec (args, options, callback) {
  options = options || {};
  var env = Object.assign({}, options.env, process.env);

  return cp.exec("node " + fxRunner + " " + args, {
    cwd: options.cwd || __dirname,
    env: env
  }, function (err, stdout, stderr) {
    if (callback)
      callback.apply(null, arguments);
    else if (err)
      throw err;
  });
}
exports.exec = exec;
