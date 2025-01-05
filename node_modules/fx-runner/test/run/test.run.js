/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var when = require("when");
var path = require("path");
var utils = require("../utils");
var chai = require("chai");
var expect = chai.expect;
var exec = utils.exec;
var isWindows = /^win/.test(process.platform);
var normalizeBinary = require("../../lib/utils").normalizeBinary;
var run = require("../../lib/run");
var cp = require("child_process");
var parse = require("shell-quote").parse;

var fakeBinary = path.join(__dirname, "..", "utils", "dummybinary" +
  (isWindows ? ".bat" : ".sh"));

describe("fx-runner start", function () {
  describe("-b/--binary <FAKE_BINARY>", function () {
    it("-p <name>", function (done) {
      var proc = exec("start -v -b " + fakeBinary + " -p foo", {}, function (err, stdout, stderr) {
        expect(err).to.not.be.ok;
        expect(stderr).to.not.be.ok;
        expect(stdout).to.contain("-P foo");
        expect(stdout).to.not.contain("--P");
        expect(stdout).to.not.contain("-foreground");
        expect(stdout).to.not.contain("-no-remote");
        expect(stdout).to.not.contain("-new-instance");
        done();
      });
    });

    it("-p <path>", function (done) {
      var proc = exec("start -v -b " + fakeBinary + " -p ./", {}, function (err, stdout, stderr) {
        expect(err).to.not.be.ok;
        expect(stderr).to.not.be.ok;
        expect(stdout).to.contain("-profile ./");
        expect(stdout).to.not.contain("--profile");
        expect(stdout).to.not.contain("--P");
        expect(stdout).to.not.contain("-foreground");
        expect(stdout).to.not.contain("-no-remote");
        expect(stdout).to.not.contain("-new-instance");
        done();
      });
    });

    it("--binary-args <CMDARGS>", function (done) {
      var proc = exec("start -v -b " + fakeBinary + " --binary-args \"-test\" ./", {}, function (err, stdout, stderr) {
        expect(err).to.not.be.ok;
        expect(stderr).to.not.be.ok;
        expect(stdout).to.contain("-test");
        expect(stdout).to.not.contain("--binary-args");
        expect(stdout).to.not.contain("--profile");
        expect(stdout).to.not.contain("--P");
        expect(stdout).to.not.contain("-foreground");
        expect(stdout).to.not.contain("-no-remote");
        expect(stdout).to.not.contain("-new-instance");
        done();
      });
    });

    it("--foreground", function (done) {
      var proc = exec("start -v -b " + fakeBinary + " --foreground", {}, function (err, stdout, stderr) {
        expect(err).to.not.be.ok;
        expect(stderr).to.not.be.ok;
        expect(stdout).to.contain("-foreground");
        expect(stdout).to.not.contain("--foreground");
        expect(stdout).to.not.contain("-P");
        expect(stdout).to.not.contain("-no-remote");
        expect(stdout).to.not.contain("-new-instance");
        done();
      });
    });

    it("--no-remote", function (done) {
      var proc = exec("start -v -b " + fakeBinary + " --no-remote", {}, function (err, stdout, stderr) {
        expect(err).to.not.be.ok;
        expect(stderr).to.not.be.ok;
        expect(stdout).to.contain("-no-remote");
        expect(stdout).to.not.contain("--no-remote");
        expect(stdout).to.not.contain("-P");
        expect(stdout).to.not.contain("-foreground");
        expect(stdout).to.not.contain("-new-instance");
        done();
      });
    });

    it("--new-instance", function (done) {
      var proc = exec("start -v -b " + fakeBinary + " --new-instance", {}, function (err, stdout, stderr) {
        expect(err).to.not.be.ok;
        expect(stderr).to.not.be.ok;
        expect(stdout).to.contain("-new-instance");
        expect(stdout).to.not.contain("--new-instance");
        expect(stdout).to.not.contain("-P");
        expect(stdout).to.not.contain("-foreground");
        expect(stdout).to.not.contain("-no-remote");
        done();
      });
    });

    it("--listen", function (done) {
      var proc = exec("start -v -b " + fakeBinary + " --listen 6666", {}, function (err, stdout, stderr) {
        expect(err).to.not.be.ok;
        expect(stderr).to.not.be.ok;
        expect(stdout).to.contain("-start-debugger-server");
        expect(stdout).to.contain("6666");
        expect(stdout).to.not.contain("--listen");
        expect(stdout).to.not.contain("-P");
        expect(stdout).to.not.contain("-foreground");
        expect(stdout).to.not.contain("-no-remote");
        done();
      });
    });
  });
});

describe("concat binary arguments", function () {
  it("concats binary arguments from a string", function () {
    var arr = parse("-a b -c \"d e\"");
    expect(arr[0]).to.be.equal("-a");
    expect(arr[1]).to.be.equal("b");
    expect(arr[2]).to.be.equal("-c");
    expect(arr[3]).to.be.equal("d e");
  });
});

describe("buildArgs", () => {
  it("returns a list of arguments", () => {
    const options = {
      foreground: true,
      'binary-args': ["-a", 1, "-b", "--long-flag"],
    };
    expect(run.buildArgs(options)).to.be.eql([
      "-foreground",
      "-a",
      1,
      "-b",
      "--long-flag",
    ]);
  });

  it("puts the binary args first when `binary-args-first` is `true`", () => {
    const options = {
      foreground: true,
      'binary-args': ["run", "app", "--long-flag"],
      'binary-args-first': true,
    };
    expect(run.buildArgs(options)).to.be.eql([
      "run",
      "app",
      "--long-flag",
      "-foreground",
    ]);
  });

});
