/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var os = require("os");
var fs = require("fs");
var path = require("path");
var chai = require("chai");
var expect = chai.expect;
var utils = require("../../lib/utils");
var all = require("when").all;
var sandbox = require('sandboxed-module');
var binary = utils.normalizeBinary;
var which = require("which");

var prevDir, prevBinary;

sandbox.configure({
  globals: {
    // As of Node 12.x, the process global is no longer an enumerable property of the global.
    // https://github.com/nodejs/node/pull/26882
    // Consequently, sandboxed-module is unable to find the global. To fix this, explicitly
    // export the "process" global, so that modules (e.g. "which") that use "process" are
    // able to obtain the "process" global from the sandbox.
    process: process,
  },
});

describe("lib/utils", function () {
  it("normalizeBinary() finds binary by accessing the registry on Windows", function(done) {
    // Skip this test for now, to get Travis running.
    if (!/win/i.test(os.platform)) {
      done();
      return;
    }

    var expected = "fake\\binary\\path";

    // see ./mock-winreg.js
    // Only mock keys in HKLM (local machine) hive.
    // This test case checks the basic functionality if the user does not have a newer version of
    // Firefox installed meaning the HKCU keys are not present.
    var winreg = function(options) {
      this.get = function(_, fn) {
        if (options.hive === winreg.HKLM) {
          fn(null, {value: expected});
        } else {
          fn("Failed", null);
        }
      };
    };
    winreg.HKLM = "HKLM";

    var binary = sandbox.require("../../lib/utils", {
      requires: { winreg }
    }).normalizeBinary;

    var promises = [
      [null, "windows", "x86"],
      [null, "windows", "x86_64"]
    ].map(function(args) {
      var promise = binary.apply(binary, args);
      return promise.then(function(actual) {
        expect(actual).to.be.equal(expected);
      });
    });
    all(promises).then(done.bind(null, null), done);
  });

  it("normalizeBinary() prefers HKCU registry hive over HKLM on Windows", function(done) {
    // Skip this test for now, to get Travis running.
    if (!/win/i.test(os.platform)) {
      done();
      return;
    }

    // Provide different paths depending on hive.
    // This test case checks that in order to find recent versions of Firefox, HKCU is tried
    // before falling back on HKCU as in the test above.
    var expected = "fake\\binary\\path";
    var oldPath = "fake\\old\\binary\\path";

    // see ./mock-winreg.js
    var winreg = function(options) {
      this.get = function(_, fn) {
        if (options.hive === winreg.HKCU) {
          fn(null, {value: expected});
        } else if (options.hive === winreg.HKLM) {
          fn(null, {value: oldPath});
        } else {
          fn("Failed", null);
        }
      };
    };
    // Differentiate hives
    winreg.HKLM = "HKLM";
    winreg.HKCU = "HKCU";

    var binary = sandbox.require("../../lib/utils", {
      requires: { winreg }
    }).normalizeBinary;

    var promises = [
      [null, "windows", "x86"],
      [null, "windows", "x86_64"]
    ].map(function(args) {
      var promise = binary.apply(binary, args);
      return promise.then(function(actual) {
        expect(actual).to.be.equal(expected);
      });
    });
    all(promises).then(done.bind(null, null), done);
  });

  it("normalizeBinary() uses env var when registry access fails on Windows", function(done) {
    var args = 0;
    var expected = 1;

    var envPath64 = "path\\from\\env\\var\\64";
    var envPath32 = "path\\from\\env\\var\\32";

    var binary = sandbox.require("../../lib/utils", {
      requires: {"winreg": function() {
        this.get = function(_, fn) {
          fn("Failed", null);
        };
      }},
      locals: {process: {env: {"ProgramFiles": envPath32, "ProgramFiles(x86)": envPath64}}}
    }).normalizeBinary;

    var promises = [
      [[null, "windows", "x86"], path.join(envPath32, "Mozilla Firefox", "firefox.exe")],
      [[null, "windows", "x86_64"], path.join(envPath64, "Mozilla Firefox", "firefox.exe")]
    ].map(function(fixture) {
      var promise = binary.apply(binary, fixture[args]);
      return promise.then(function(actual) {
        expect(actual).to.be.equal(fixture[expected]);
      });
    });
    all(promises).then(done.bind(null, null), done);
  });

  it("normalizeBinary() default sets (OS X)", function (done) {
    delete process.env.JPM_FIREFOX_BINARY;
    var args = 0;
    var expected = 1;

    var promises = [
      [[null, "darwin", "x86"], "/Applications/Firefox.app/Contents/MacOS/firefox"],
      [[null, "darwin", "x86_64"], "/Applications/Firefox.app/Contents/MacOS/firefox"]
    ].map(function(fixture) {
      var promise = binary.apply(binary, fixture[args]);
      return promise.then(function(actual) {
        expect(actual).to.be.equal(fixture[expected]);
      });
    });
    all(promises).then(done.bind(null, null), done);
  });

  it("normalizeBinary() default sets (linux)", function (done) {
    delete process.env.JPM_FIREFOX_BINARY;
    var args = 0;
    var expected = 1;

    var binary = sandbox.require("../../lib/utils", {
      requires: {
        which: function(bin, callback) {
          callback(null, "/usr/bin/" + bin);
        }
      }
    }).normalizeBinary;

    var promises = [
      [[null, "linux", "x86"], "/usr/bin/firefox"],
      [[null, "linux", "x86_64"], "/usr/bin/firefox"]
    ].map(function(fixture) {
      var promise = binary.apply(binary, fixture[args]);
      return promise.then(function(actual) {
        expect(actual).to.be.equal(fixture[expected]);
      });
    });
    all(promises).then(done.bind(null, null), done);
  });

  it("normalizeBinary() returns binary path if passed", function (done) {
    var bPath = "/path/to/binary";
    binary(bPath).then(function(actual) {
      expect(actual).to.be.equal(bPath);
    }).then(done.bind(null, null), done);
  });

  it("normalizeBinary() finds OSX's full path when given .app", function (done) {
    process.env.JPM_FIREFOX_BINARY = undefined;
    binary("/Application/FirefoxNightly.app", "darwin").then(function(actual) {
      expect(actual).to.be.equal(
        path.join("/Application/FirefoxNightly.app/Contents/MacOS/firefox"));
    }).then(done.bind(null, null), done);
  });

  it("normalizeBinary() uses JPM_FIREFOX_BINARY if no path specified", function (done) {
    process.env.JPM_FIREFOX_BINARY = "/my/custom/path";
    binary().then(function(actual) {
      expect(actual).to.be.equal("/my/custom/path");
    }).then(done.bind(null, null), done);
  });

  it("normalizeBinary() uses path over JPM_FIREFOX_BINARY if specified", function (done) {
    process.env.JPM_FIREFOX_BINARY = "/my/custom/path";
    binary("/specific/path").then(function(actual) {
      expect(actual).to.be.equal("/specific/path");
    }).then(done.bind(null, null), done);
  });

  it("normalizeBinary() normalizes special names like: nightly, beta, etc... on Windows", function(done) {
    var args = 0;
    var expected = 1;

    var binary = sandbox.require("../../lib/utils", {
      requires: {"winreg": function(options) {
        var value = "Normal or beta";
        if (options.key.toLowerCase().indexOf("nightly") != -1) {
          value = "nightly";
        }
        if (options.key.toLowerCase().indexOf("aurora") != -1) {
          value = "aurora";
        }
        this.get = function(_, fn) {
          fn(null, {value: value});
        };
      }},
      locals: {process: {env: {"ProgramFiles": "envPath32", "ProgramFiles(x86)": "envPath64"}}}
    }).normalizeBinary;

    var promises = [
      [["nightly", "windows", "x86"], "nightly"],
      [["nightly", "windows", "x86_64"], "nightly"],
      [["aurora", "windows", "x86"], "aurora"],
      [["aurora", "windows", "x86_64"], "aurora"]
    ].map(function(fixture) {
      var promise = binary.apply(binary, fixture[args]);
      return promise.then(function(actual) {
        expect(actual).to.be.equal(fixture[expected]);
      });
    });
    all(promises).then(done.bind(null, null), done);
  });

  it("normalizeBinary() normalizes special names like: firefox, nightly, etc... on Linux", function(done) {
    var args = 0;
    var expected = 1;

    var binary = sandbox.require("../../lib/utils", {
      requires: {
        which: function(bin, callback) {
          callback(null, "/usr/bin/" + bin);
        }
      }
    }).normalizeBinary;

    var promises = [
      [["firefox", "linux", "x86"], "/usr/bin/firefox"],
      [["firefox", "linux", "x86_64"], "/usr/bin/firefox"],

      [["beta", "linux", "x86"], "/usr/bin/firefox-beta"],
      [["beta", "linux", "x86_64"], "/usr/bin/firefox-beta"],

      [["aurora", "linux", "x86"], "/usr/bin/firefox-aurora"],
      [["aurora", "linux", "x86_64"], "/usr/bin/firefox-aurora"],

      [["firefoxdeveloperedition", "linux", "x86"], "/usr/bin/firefox-developer-edition"],
      [["firefoxdeveloperedition", "linux", "x86_64"], "/usr/bin/firefox-developer-edition"],

      [["nightly", "linux", "x86_64"], "/usr/bin/firefox-nightly"],
      [["nightly", "linux", "x86_64"], "/usr/bin/firefox-nightly"],
    ].map(function(fixture) {
      var promise = binary.apply(binary, fixture[args]);
      return promise.then(function(actual) {
        expect(actual).to.be.equal(fixture[expected]);
      });
    });
    all(promises).then(done.bind(null, null), done);
  });

  it("normalizeBinary() normalizes special names like: firefox, nightly, etc... on OS X", function(done) {
    var args = 0;
    var expected = 1;

    var promises = [
      [["firefox", "darwin", "x86"], "/Applications/Firefox.app/Contents/MacOS/firefox"],
      [["firefox", "darwin", "x86_64"], "/Applications/Firefox.app/Contents/MacOS/firefox"],

      [["beta", "darwin", "x86"], "/Applications/Firefox.app/Contents/MacOS/firefox"],
      [["beta", "darwin", "x86_64"], "/Applications/Firefox.app/Contents/MacOS/firefox"],

      [["firefoxdeveloperedition", "darwin", "x86"], "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox"],
      [["firefoxdeveloperedition", "darwin", "x86_64"], "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox"],

      [["deved", "darwin", "x86"], "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox"],
      [["deved", "darwin", "x86_64"], "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox"],

      [["aurora", "darwin", "x86"], "/Applications/FirefoxAurora.app/Contents/MacOS/firefox"],
      [["aurora", "darwin", "x86_64"], "/Applications/FirefoxAurora.app/Contents/MacOS/firefox"],

      [["nightly", "darwin", "x86"], "/Applications/Firefox Nightly.app/Contents/MacOS/firefox"],
      [["nightly", "darwin", "x86_64"], "/Applications/Firefox Nightly.app/Contents/MacOS/firefox"]
    ].map(function (fixture) {
      var promise = binary.apply(binary, fixture[args]);
      return promise.then(function(actual) {
        expect(actual).to.be.equal(fixture[expected]);
      });
    });
    all(promises).then(done.bind(null, null), done);
  });

  describe("findMacAppByChannel", function() {

    var defaultNightly = "/Applications/Firefox Nightly.app/Contents/MacOS/firefox";

    function spawnSyncStub(stdout) {
      return function() {
        return {stdout: stdout};
      }
    }

    it("returns false when no app is found", function() {
      var result = utils.findMacAppByChannel("nightly", {spawnSync: spawnSyncStub("")});
      expect(result).to.be.equal(null);
    });

    it("returns sole app result", function() {
      var result = utils.findMacAppByChannel("nightly", {
        spawnSync: spawnSyncStub(defaultNightly + "\n"),
      });
      expect(result).to.be.equal(defaultNightly);
    });

    it("prefers to find the default app", function() {
      var result = utils.findMacAppByChannel("nightly", {
        spawnSync: spawnSyncStub([
          "/src/mozilla-central/Nightly.app/Contents/MacOS/firefox",
          defaultNightly,
        ].join("\n")),
      });
      expect(result).to.be.equal(defaultNightly);
    });

    it("falls back to the first app result", function() {
      var randomApp = "/src/mozilla-central/Nightly.app/Contents/MacOS/firefox";
      var result = utils.findMacAppByChannel("nightly", {
        spawnSync: spawnSyncStub(randomApp + "\n"),
      });
      expect(result).to.be.equal(randomApp);
    });

  });
});
