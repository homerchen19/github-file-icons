# firefox-profile-js

[![Build Status](https://travis-ci.org/saadtazi/firefox-profile-js.png)](https://travis-ci.org/saadtazi/firefox-profile-js)
[![Coverage Status](https://coveralls.io/repos/saadtazi/firefox-profile-js/badge.png)](https://coveralls.io/r/saadtazi/firefox-profile-js)
[![Dependency Status](https://david-dm.org/saadtazi/firefox-profile-js.png)](https://david-dm.org/saadtazi/firefox-profile-js)
[![Selenium Test Status](https://saucelabs.com/buildstatus/saadtazi)](https://saucelabs.com/u/saadtazi)

[![NPM](https://nodei.co/npm/firefox-profile.png)](https://nodei.co/npm/firefox-profile/)

Create or update Firefox Profile programmatically.

## Notes for Selenium-webdriver package users

If you are using [`selenium-webdriver` package](http://seleniumhq.github.io/selenium/docs/api/javascript/), you no longer need to use this package: `selenium-webdriver` package now implements [a class that allows to create firefox profiles](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/firefox/profile.html). Check
[this link](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/firefox.html)
for an example on how to set your own profile with `selenium-webdriver`. But you can still use this package with `selenium-webdriver`: here is [an example](https://github.com/juliemr/protractor-demo/issues/26). The important part in the example is to set the encoded profile on `.moz:firefoxOptions.profile` instead of on `.firefox_profile`.

This package is also useful if you use another webdriver library like [`wd.js`](http://admc.io/wd/) or any other webdriver json wire protocol implementation (`webdriver.io`?).

# Introduction

This package allows you to:

- create a firefox profile
- use an existing profile (by specifying a path)
- use an existing user profile (by specifying a name)
- add extensions to your profile,
- specify proxy settings,
- set the user preferences...

More info on user preferences [here](http://kb.mozillazine.org/User.js_file).

It also contains a [command line interface](#command-line-interface) that allows to copy or create profiles.

## Installation

~~"real" npm support is on its way... soon... maybe... Open an issue if you need it...~~ Use npm:

```
npm install firefox-profile
```

or `yarn`:

```
yarn add firefox-profile
```

## Usage

Make sure you have selenium server running... or use 'selenium-webdriver/remote' class.

### Steps

- create a profile
- modify the profile:
  - setPreference(key, value)
  - addExtension(path/To/Extenstion.xpi) or addExtension(path/To/Unpacked/Extension/)
- create firefox capabilities and set the 'firefox_profile' capability
- attach the capabilitites to your webdriver

### I wanna see it!

```js
/******************************************************************
     * with old version selenium webdriverJs
     * WARNING: does not work with recent version of selenium-webdriver node bindings, which expect an instance of selenium-webdriver Firefox Profile page (`require('selenium-webdriver/firefox').Profile` or similar)
     * @see: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/firefox/profile_exports_Profile.html
     * installs firebug 
     * and make http://saadtazi.com the url that is opened on new tabs
    /******************************************************************/
var webdriver = require("selenium-webdriver");

// create profile
var FirefoxProfile = require("firefox-profile");
var myProfile = new FirefoxProfile();

// you can add an extension by specifying the path to the xpi file
// or to the unzipped extension directory
myProfile.addExtension("test/extensions/firebug-1.12.4-fx.xpi", function () {
  var capabilities = webdriver.Capabilities.firefox();

  // you can set firefox preferences BEFORE calling encoded()
  myProfile.setPreference("browser.newtab.url", "http://saadtazi.com");

  // attach your newly created profile

  myProfile.encoded(function (err, encodedProfile) {
    capabilities.set("firefox_profile", encodedProfile);

    // start the browser
    var wd = new webdriver.Builder().withCapabilities(capabilities).build();

    // woot!
    wd.get("http://en.wikipedia.org");
  });
});

/**************************************************
    /* with admc/wd
    /* installs firebug, and make it active by default
    /**************************************************/

var FirefoxProfile = require("firefox-profile"),
  wd = require("wd");

// set some userPrefs if needed
// Note: make sure you call encoded() after setting some userPrefs
var fp = new FirefoxProfile();
// activate and open firebug by default for all sites
fp.setPreference("extensions.firebug.allPagesActivation", "on");
// activate the console panel
fp.setPreference("extensions.firebug.console.enableSites", true);
// show the console panel
fp.setPreference("extensions.firebug.defaultPanelName", "console");
// done with prefs?
fp.updatePreferences();

// you can install multiple extensions at the same time
fp.addExtensions(["./test/extensions/firebug-1.12.4-fx.xpi"], function () {
  fp.encoded(function (err, zippedProfile) {
    if (err) {
      console.error("oops, an error occured:", err);
      return;
    }
    browser = wd.promiseChainRemote();
    // firefox 46-
    //browser.init({
    //  browserName:'firefox',
    //  // set firefox_profile capabilities HERE!!!!
    //  firefox_profile: zippedProfile
    //}).
    // firefox 47+
    browser.init({
      browserName: "firefox",
      marionette: true,
      "moz:firefoxOptions": {
        profile: zippedProfile,
      },
    });
    // woOot!!
    get("http://en.wikipedia.org");
  });
});
```

You can also copy an existing profile... Check the doc `FirefoxProfile.copy(...)`.

## Command Line Interface

It allows to copy (from profile name or profile directory) or create firefox profiles with installed extensions. Note that it does not allow to load user preferences... yet.

Run `node_modules/bin/firefox-profile -h` to get the help message:

```
usage: firefox-profile [-v] [-p profilename || -c profile_dir] [-e extension_path1 [-e extension_path2]] [-o destination_dir || --ouput destination_dir || -b [file_path] || --base64 [file_path]]

-v: verbose mode (same as --verbose)
-h: show this message (same as --help)
-p profilename: profile to copy (same as --profile)
-c profile_dir: profile folder path to copy (same as --copy)
-e extension_path: file path to extension to add to the profile. Can be present multiple times (same as --extension)
-o destination_dir (or --output destination_dir): folder where the profile will be created.
-b [file_path](or --base64): write the encoded firefox profile to stdout or to file_path if specified.
```

## API Documentation

The API documentation can be found in [doc/](./doc/).

It can be regenerated using `grunt docs`.
Requires [apidox](https://github.com/codeactual/apidox) - listed in devDependencies.

## Tests

    mocha
    # or
    grunt mochacov:unit

## Coverage

    grunt mochacov:coverage

Generates doc/coverage.html

## TODO

- ~~add documentation and comments~~
- ~~write tests~~
- ~~fix bugs~~
- ~~write more tests~~
- fix more bugs
- ~~clean tmp directory on process 'exit' and 'SIGINT'~~

## Disclaimer

This class is actually a port of the [python class](https://code.google.com/p/selenium/source/browse/py/selenium/webdriver/firefox/firefox_profile.py).

## Found a bug?

Open a [github issue](https://github.com/saadtazi/firefox-profile-js/issues).
