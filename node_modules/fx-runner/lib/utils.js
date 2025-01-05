/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var defaultSpawnSync = require("spawn-sync");
var path = require("path");
var os = require("os");
var Winreg = require("winreg");
var when = require("when");
var which = require("when/node").lift(require("which"));

/**
 * Takes a path to a binary file (like `/Applications/FirefoxNightly.app`)
 * and based on OS, resolves to the actual binary file. Accepts an optional
 * `platform` and `arch` parameter for testing.
 *
 * @param {string} binaryPath
 * @param {string} [platform]
 * @param {string} [arch]
 * @return {Promise}
 */
function normalizeBinary (binaryPath, platform, arch) {
  return when.promise(function(resolve, reject) {
    platform = platform || os.platform();
    arch = arch || os.arch();
    binaryPath = binaryPath || process.env.JPM_FIREFOX_BINARY || "firefox";

    arch = /64/.test(arch) ? "(64)" : "";
    platform = /darwin/i.test(platform) ? "osx" :
               /win/i.test(platform) ? "windows" + arch :
               /linux/i.test(platform) ? "linux" + arch :
               platform;

    if (binaryPath === "deved") {
      binaryPath = "firefoxdeveloperedition";
    }

    var app = binaryPath.toLowerCase();

    if (platform === "osx") {
      var result = null;
      var channelNames = [
        "firefox", "firefoxdeveloperedition", "beta", "nightly", "aurora"
      ];

      if (channelNames.indexOf(binaryPath) !== -1) {
        result = findMacAppByChannel(binaryPath);
      }
      binaryPath = result ||
                   normalizeBinary.paths[app + " on " + platform] ||
                   binaryPath;
      var isAppPath = path.extname(binaryPath) === ".app";

      // On OSX, if given the app path, resolve to the actual binary
      // We use `firefox` since `firefox-bin` is gone thanks to
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1871447
      binaryPath = isAppPath ? path.join(binaryPath, "Contents/MacOS/firefox") :
                   binaryPath;

      return resolve(binaryPath);
    }
    // Return the path if it contains at least two segments
    else if (binaryPath.indexOf(path.sep) !== -1) {
      return resolve(binaryPath);
    }
    // On linux but no path yet, use which to try and find the binary
    else if (platform.indexOf("linux") !== -1) {
        binaryPath = normalizeBinary.appNames[binaryPath + " on linux"] || binaryPath;
        return resolve(which(binaryPath));
    }
    // No action needed on windows if it's an executable already
    else if (path.extname(binaryPath) === ".exe") {
      return resolve(binaryPath);
    }
    // Windows binary finding
    var appName = normalizeBinary.appNames[app + " on windows"];

    resolve(getPathToExe(Winreg.HKCU, appName).catch(function() {
      return getPathToExe(Winreg.HKLM, appName);
    }).catch(function() {
      // Neither registry hive has the correct keys
      var programFilesVar = "ProgramFiles";
      if (arch === "(64)") {
        console.warn("You are using 32-bit version of Firefox on 64-bit versions of the Windows.\nSome features may not work correctly in this version. You should upgrade Firefox to the latest 64-bit version now!")
        programFilesVar = "ProgramFiles(x86)";
      }
      return path.join(process.env[programFilesVar], appName, "firefox.exe");
    }));
  });
}

// Returns a promise to get Firefox's PathToExe from a registry hive
function getPathToExe(hive, appName) {
  const rootKey = path.join("\\Software\\Mozilla\\", appName);

  return getRegistryValue(hive, rootKey, "CurrentVersion").then(function(version) {
    return getRegistryValue(hive, path.join(rootKey, version, "Main"), "PathToExe");
  });
}

// Returns a promise to get a single registry value
function getRegistryValue(hive, key, name) {
  return when.promise(function(resolve, reject) {
    const registry = new Winreg({ hive, key });

    registry.get(name, function(error, resultKey) {
      if (resultKey && !error) {
        resolve(resultKey.value);
      } else {
        reject(error);
      }
    });
  });
}

normalizeBinary.paths = {
  "firefox on osx": "/Applications/Firefox.app/Contents/MacOS/firefox",
  // the name of the beta application bundle is the same as the stable one
  "beta on osx": "/Applications/Firefox.app/Contents/MacOS/firefox",
  "firefoxdeveloperedition on osx": "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox",
  "aurora on osx": "/Applications/FirefoxAurora.app/Contents/MacOS/firefox",
  "nightly on osx": "/Applications/Firefox Nightly.app/Contents/MacOS/firefox",
};

normalizeBinary.appNames = {
  "firefox on linux": "firefox",
  "beta on linux": "firefox-beta",
  "aurora on linux": "firefox-aurora",
  "firefoxdeveloperedition on linux": "firefox-developer-edition",
  "nightly on linux": "firefox-nightly",
  "firefox on windows": "Mozilla Firefox",
  // the default path in the beta installer is the same as the stable one
  "beta on windows": "Mozilla Firefox",
  "firefoxdeveloperedition on windows": "Firefox Developer Edition",
  "aurora on windows": "Aurora",
  "nightly on windows": "Nightly"
};

exports.normalizeBinary = normalizeBinary;

function findMacAppByChannel(channel, opt) {
  // Try to find an installed app on Mac OS X for this channel.
  opt = opt || {
    spawnSync: defaultSpawnSync,
  };
  // Example: mdfind "kMDItemCFBundleIdentifier == 'org.mozilla.nightly'"
  var results = opt.spawnSync(
    "mdfind", ["kMDItemCFBundleIdentifier == 'org.mozilla." + channel + "'"]
  );
  var result = null;
  if (results.stdout) {
    var allMatches = results.stdout.toString().split("\n");
    var officialApp = allMatches.filter(function(path) {
      // Prefer the one installed in the official app location:
      return path.indexOf("/Applications/") === 0;
    })[0];

    if (officialApp) {
      result = officialApp;
    } else {
      // Fall back to the first mdfind match.
      result = allMatches[0];
    }
  }

  return result;
}

exports.findMacAppByChannel = findMacAppByChannel;
