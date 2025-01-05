/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var Mocha = require("mocha");
var mocha = new Mocha({
  ui: "bdd",
  reporter: "spec",
  timeout: 900000
});

[
  require.resolve("./run/test.run.js"),
  require.resolve("./run/test.utils.js"),
].sort().forEach(function(filepath) {
  filepath && mocha.addFile(filepath);
})

mocha.run(function (failures) {
  process.exit(failures);
});
