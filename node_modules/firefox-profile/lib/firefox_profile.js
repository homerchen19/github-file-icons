/**
 * Firefox Profile
 */
'use strict';

var os = require('os'),
  path = require('path'),
  util = require('util'),
  fs = require('fs-extra'),
  // third-party
  parseString = require('xml2js').parseString,
  AdmZip = require('adm-zip'),
  Finder = require('./profile_finder');

var config = {
  // from python... Not used
  // WEBDRIVER_EXT: 'webdriver.xpi',
  // EXTENSION_NAME: 'fxdriver@googlecode.com',
  ANONYMOUS_PROFILE_NAME: 'WEBDRIVER_ANONYMOUS_PROFILE',
  DEFAULT_PREFERENCES: {
    'app.update.auto': 'false',
    'app.update.enabled': 'false',
    'browser.download.manager.showWhenStarting': 'false',
    'browser.EULA.override': 'true',
    'browser.EULA.3.accepted': 'true',
    'browser.link.open_external': '2',
    'browser.link.open_newwindow': '2',
    'browser.offline': 'false',
    'browser.safebrowsing.enabled': 'false',
    'browser.search.update': 'false',
    'extensions.blocklist.enabled': 'false',
    'browser.sessionstore.resume_from_crash': 'false',
    'browser.shell.checkDefaultBrowser': 'false',
    'browser.tabs.warnOnClose': 'false',
    'browser.tabs.warnOnOpen': 'false',
    'browser.startup.page': '0',
    'browser.safebrowsing.malware.enabled': 'false',
    'startup.homepage_welcome_url': '"about:blank"',
    'devtools.errorconsole.enabled': 'true',
    'dom.disable_open_during_load': 'false',
    'extensions.autoDisableScopes': 10,
    'extensions.logging.enabled': 'true',
    'extensions.update.enabled': 'false',
    'extensions.update.notifyUser': 'false',
    'network.manage-offline-status': 'false',
    'network.http.max-connections-per-server': '10',
    'network.http.phishy-userpass-length': '255',
    'offline-apps.allow_by_default': 'true',
    'prompts.tab_modal.enabled': 'false',
    'security.fileuri.origin_policy': '3',
    'security.fileuri.strict_origin_policy': 'false',
    'security.warn_entering_secure': 'false',
    'security.warn_entering_secure.show_once': 'false',
    'security.warn_entering_weak': 'false',
    'security.warn_entering_weak.show_once': 'false',
    'security.warn_leaving_secure': 'false',
    'security.warn_leaving_secure.show_once': 'false',
    'security.warn_submit_insecure': 'false',
    'security.warn_viewing_mixed': 'false',
    'security.warn_viewing_mixed.show_once': 'false',
    'signon.rememberSignons': 'false',
    'toolkit.networkmanager.disable': 'true',
    'toolkit.telemetry.enabled': 'false',
    'toolkit.telemetry.prompted': '2',
    'toolkit.telemetry.rejected': 'true',
    'javascript.options.showInConsole': 'true',
    'browser.dom.window.dump.enabled': 'true',
    webdriver_accept_untrusted_certs: 'true',
    webdriver_enable_native_events: 'true',
    webdriver_assume_untrusted_issuer: 'true',
    'dom.max_script_run_time': '30',
  },
};

/**
 * Regex taken from XPIProvider.jsm in the Addon Manager to validate proper
 * IDs that are able to be used:
 * https://searchfox.org/mozilla-central/rev/c8ce16e4299a3afd560320d8d094556f2b5504cd/toolkit/mozapps/extensions/internal/XPIProvider.jsm#182
 */
function isValidAOMAddonId(s) {
  return /^(\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}|[a-z0-9-\._]*\@[a-z0-9-\._]+)$/i.test(
    s || ''
  );
}

/**
 * Return the addon id given the addon manifest file.
 *
 * TODO: this still includes backward compatibility with the deprecated jetpack
 * manifest file, it could be removed in a follow up (along with rewriting some
 * of the test cases).
 */
function getID(manifest) {
  if (manifest.id) {
    return isValidAOMAddonId(manifest.id) ? manifest.id : null;
  }

  // This is currently used to keep the backward compatible behavior
  // expected on the deprecated jetpack extensions manifest file.
  if (manifest.name && typeof manifest.name == 'string') {
    const id = `@${manifest.name}`;
    return isValidAOMAddonId(id) ? id : null;
  }

  return null;
}

function unprefix(root, node, prefix) {
  return root[prefix + ':' + node] || root[node];
}

function parseOptions(opts) {
  if (typeof opts === 'string') {
    return { profileDirectory: opts };
  }
  return opts || {};
}

function isNotLockFile(filePath) {
  var file = path.basename(filePath);
  return !/^(parent\.lock|lock|\.parentlock)$/.test(file);
}
/**
 * Initialize a new instance of a Firefox Profile.
 *
 * Note that this function uses filesystem sync functions to copy an existing profile (id profileDirectory is provided)
 * which is not optimized.
 * If you need optimzed async version, use `FirefoxProfile.copy(profileDirectory, cb);`
 *
 * @param {Object|String|null} options optional.
 *
 *
 * If it is an object, it can contain the following option:
 * * profileDirectory: the profile to copy. Not recommended: use FirefoxProfile.copy instead
 * * destinationDirectory: where the profile will be stored. If not provided,
 *    a tmp directory will be used WARNING: if the tmp directory will be deleted when the process will terminate.
 *
 * if it is a string it will copy the directory synchronously
 *   (not recommended at all, kept for backward compatibility).
 */
function FirefoxProfile(options) {
  var opts = parseOptions(options),
    hasDestDir = !!opts.destinationDirectory;
  this.profileDir = opts.profileDirectory;
  this.defaultPreferences = { ...config.DEFAULT_PREFERENCES };
  // if true, the profile folder is deleted after
  this._deleteOnExit = !hasDestDir;
  // can be turned to false when debugging
  this._deleteZippedProfile = true;
  this._preferencesModified = false;
  if (!this.profileDir) {
    this.profileDir = opts.destinationDirectory || this._createTempFolder();
  } else {
    // create copy
    var tmpDir = opts.destinationDirectory || this._createTempFolder('copy-');
    fs.copySync(opts.profileDirectory, tmpDir, {
      clobber: true,
      filter: isNotLockFile,
    });
    this.profileDir = tmpDir;
  }
  this.extensionsDir = path.join(this.profileDir, 'extensions');
  this.userPrefs = path.join(this.profileDir, 'user.js');
  if (fs.pathExistsSync(this.userPrefs)) {
    this._readExistingUserjs();
  }

  // delete on process.exit()...
  var self = this;
  this.onExit = function () {
    if (self._deleteOnExit) {
      self._cleanOnExit();
    }
  };

  this.onSigInt = function () {
    process.exit(130);
  };
  process.addListener('exit', self.onExit);
  process.addListener('SIGINT', self.onSigInt);
}

FirefoxProfile.prototype._copy = function (profileDirectory, cb) {
  fs.copy(
    profileDirectory,
    this.profileDir,
    {
      clobber: true,
      filter: isNotLockFile,
    },
    cb
  );
};

/**
 * creates a profile Profile from an existing firefox profile directory asynchronously
 *
 * @param {Object|String|null} options
 *
 * if it is an object, the following properties are available:
 * * profileDirectory - required - the profile to copy.
 * * destinationDirectory: where the profile will be stored. If not provided,
 *    a tmp directory will be used. WARNING: if the tmp directory will be deleted when the process exits.
 */

FirefoxProfile.copy = function (options, cb) {
  var opts = parseOptions(options);
  if (!opts.profileDirectory) {
    cb &&
      cb(new Error('firefoxProfile: .copy() requires profileDirectory option'));
    return;
  }
  var profile = new FirefoxProfile({
    destinationDirectory: opts.destinationDirectory,
  });
  profile._copy(opts.profileDirectory, function () {
    cb && cb(null, profile);
  });
};

/**
 * copy a profile from the current user profile
 *
 * @params {Object} opts an object with the following properties:
 *      - name: property is mandatory.
 *      - userProfilePath optional and passed to Finder constructor.
 *      - destinationDirectory optional
 */
FirefoxProfile.copyFromUserProfile = function (opts, cb) {
  if (!opts.name) {
    cb &&
      cb(
        new Error(
          'firefoxProfile: .copyFromUserProfile() requires a name options'
        )
      );
    return;
  }
  var finder = new Finder(opts.userProfilePath);
  finder.getPath(opts.name, function (err, profilePath) {
    if (err) {
      cb(err);
      return;
    }
    FirefoxProfile.copy(
      {
        destinationDirectory: opts.destinationDirectory,
        profileDirectory: profilePath,
      },
      cb
    );
  });
};

/**
 * Deletes the profile directory asynchronously.
 *
 * Call it only if you do not need the profile. Otherwise use at your own risk.
 *
 * @param cb a callback function with boolean parameter (false if the dir is not found)
 *        that will be called when the profileDir is deleted
 */
FirefoxProfile.prototype.deleteDir = function (cb) {
  var self = this;
  process.removeListener('exit', self.onExit);
  process.removeListener('SIGINT', self.onSigInt);
  this.shouldDeleteOnExit(false);
  fs.exists(this.profileDir, function (doesExists) {
    if (!doesExists) {
      cb && cb();
      return;
    }
    fs.remove(self.profileDir, function () {
      cb && cb();
    });
  });
};

/**
 * called on exit to delete the profile directory synchronously.
 *
 * this function is automatically called by default (= if willDeleteOnExit() returns true) if a tmp directory is used
 *
 * should not be called directly. process.on('exit') cannot be asynchronous: async code is not called
 *
 */
FirefoxProfile.prototype._cleanOnExit = function () {
  if (fs.existsSync(this.profileDir)) {
    try {
      // node 14.4+
      if (fs.rmSync) {
        fs.rmSync(this.profileDir, { recursive: true, force: true });
      } else {
        fs.removeSync(this.profileDir);
      }
    } catch (e) {
      console.warn(
        '[firefox-profile] cannot delete profileDir on exit',
        this.profileDir,
        e
      );
    }
  }
};

/**
 * Specify if the profile Directory should be deleted on process.exit()
 *
 * Note: by default:
 * * if the constructor is called without param: the new profile directory is deleted
 * * if the constructor is called with param (path to profile dir): the dir is copied at init and the copy is deleted on exit
 *
 * @param {boolean} true
 */
FirefoxProfile.prototype.shouldDeleteOnExit = function (bool) {
  this._deleteOnExit = bool;
};

/**
 * returns true if the profile directory will be deleted on process.exit()
 *
 * @return {boolean} true if (default)
 */
FirefoxProfile.prototype.willDeleteOnExit = function () {
  return this._deleteOnExit;
};

/**
 * Set a user preference.
 *
 * Any modification to the user preference can be persisted using this.updatePreferences()
 * If this.setPreference() is called before calling this.encoded(), then this.updatePreferences()
 * is automatically called.
 * For a comprehensive list of preference keys, see http://kb.mozillazine.org/About:config_entries
 *
 * @param {string} key - the user preference key
 * @param {boolean|string} value

 * @see about:config http://kb.mozillazine.org/About:config_entries
 */
FirefoxProfile.prototype.setPreference = function (key, value) {
  var cleanValue = '';
  if (value === true) {
    cleanValue = 'true';
  } else if (value === false) {
    cleanValue = 'false';
  } else if (typeof value === 'string') {
    cleanValue = '"' + value.replace('\n', '\\n') + '"';
  } else {
    cleanValue = parseInt(value, 10).toString();
  }
  this.defaultPreferences[key] = cleanValue;
  this._preferencesModified = true;
};

/**
 * Add an extension to the profile.
 *
 * @param {string} path - path to a xpi extension file or a unziped extension folder
 * @param {function} callback - the callback function to call when the extension is added
 */
FirefoxProfile.prototype.addExtension = function (extension, cb) {
  this._installExtension(extension, cb);
};

/**
 * Add mutliple extensions to the profile.
 *
 * @param {Array} extensions - arrays of paths to xpi extension files or unziped extension folders
 * @param {function} callback - the callback function to call when the extension is added
 */

FirefoxProfile.prototype.addExtensions = function (extensions, cb) {
  var addExtension = util.promisify(this.addExtension.bind(this));
  var promises = extensions.map((extension) =>
    addExtension(path.normalize(extension))
  );
  util.callbackify(() => Promise.all(promises))(cb);
};

/**
 * Save user preferences to the user.js profile file.
 *
 * updatePreferences() is automatically called when encoded() is called
 * (if needed = if setPreference() was called before calling encoded())
 *
 */
FirefoxProfile.prototype.updatePreferences = function () {
  this._writeUserPrefs(this.defaultPreferences);
};

/**
 * @return {string} path of the profile extension directory
 *
 */
FirefoxProfile.prototype.path = function () {
  return this.profileDir;
};

/**
 * @return {boolean} true if webdriver can accept untrusted certificates
 *
 */
FirefoxProfile.prototype.canAcceptUntrustedCerts = function () {
  return this._sanitizePref(
    this.defaultPreferences['webdriver_accept_untrusted_certs']
  );
};

/**
 * If not explicitly set, default: true
 *
 * @param {boolean} true to accept untrusted certificates, false otherwise.
 *
 */
FirefoxProfile.prototype.setAcceptUntrustedCerts = function (val) {
  this.defaultPreferences['webdriver_accept_untrusted_certs'] = val;
};

/**
 * @return {boolean} true if webdriver can assume untrusted certificate issuer
 *
 */
FirefoxProfile.prototype.canAssumeUntrustedCertIssuer = function () {
  return this._sanitizePref(
    this.defaultPreferences['webdriver_assume_untrusted_issuer']
  );
};

/**
 * If not explicitly set, default: true
 *
 * @param {boolean} true to make webdriver assume untrusted issuer.
 *
 */
FirefoxProfile.prototype.setAssumeUntrustedCertIssuer = function (val) {
  this.defaultPreferences['webdriver_assume_untrusted_issuer'] = val;
};

/**
 * @return {boolean} true if native events are enabled
 *
 */
FirefoxProfile.prototype.nativeEventsEnabled = function () {
  return this._sanitizePref(
    this.defaultPreferences['webdriver_enable_native_events']
  );
};

/**
 * If not explicitly set, default: true
 *
 * @param {boolean} boolean true to enable native events.
 *
 */
FirefoxProfile.prototype.setNativeEventsEnabled = function (val) {
  this.defaultPreferences['webdriver_enable_native_events'] = val;
};

/**
 * return zipped, base64 encoded string of the profile directory
 * for use with remote WebDriver JSON wire protocol
 *
 * @param {Function} function a callback function with first param: an error, and 2nd param: a zipped, base64 encoded string of the profile directory
 */
FirefoxProfile.prototype.encoded = function (cb) {
  try {
    var self = this;

    if (this._preferencesModified) {
      this.updatePreferences();
    }

    var zip = new AdmZip();
    zip.addLocalFolder(path.resolve(self.profileDir));
    var base64 = zip.toBuffer().toString('base64');
    cb(null, base64);
  } catch (e) {
    cb(e);
  }
};

// only '1' found in proxy.js
var ffValues = {
  direct: 0,
  manual: 1,
  pac: 2,
  system: 3,
};

// for compatibility with `selenium-webdriver`
FirefoxProfile.prototype.encode = FirefoxProfile.prototype.encoded;

/**
 * Set network proxy settings.
 *
 * The parameter `proxy` is a hash which structure depends on the value of mandatory `proxyType` key,
 * which takes one of the following string values:
 *
 * * `direct` - direct connection (no proxy)
 * * `system` - use operating system proxy settings
 * * `pac` - use automatic proxy configuration set based on the value of `autoconfigUrl` key
 * * `manual` - manual proxy settings defined separately for different protocols using values from following keys:
 * `ftpProxy`, `httpProxy`, `sslProxy`, `socksProxy`
 *
 * Examples:
 *
 * * set automatic proxy:
 *
 *      profile.setProxy({
 *          proxyType: 'pac',
 *          autoconfigUrl: 'http://myserver/proxy.pac'
 *      });
 *
 * * set manual http proxy:
 *
 *      profile.setProxy({
 *          proxyType: 'manual',
 *          httpProxy: '127.0.0.1:8080'
 *      });
 *
 * * set manual http and https proxy:
 *
 *      profile.setProxy({
 *          proxyType: 'manual',
 *          httpProxy: '127.0.0.1:8080',
 *          sslProxy: '127.0.0.1:8080'
 *      });
 *
 * @param {Object} proxy a proxy hash, mandatory key `proxyType`
 */
FirefoxProfile.prototype.setProxy = function (proxy) {
  if (!proxy || !proxy.proxyType) {
    throw new Error('firefoxProfile: not a valid proxy type');
  }
  this.setPreference('network.proxy.type', ffValues[proxy.proxyType]);
  switch (proxy.proxyType) {
    case 'manual':
      if (proxy.noProxy) {
        this.setPreference('network.proxy.no_proxies_on', proxy.noProxy);
      }
      this._setManualProxyPreference('ftp', proxy.ftpProxy);
      this._setManualProxyPreference('http', proxy.httpProxy);
      this._setManualProxyPreference('ssl', proxy.sslProxy);
      this._setManualProxyPreference('socks', proxy.socksProxy);
      break;
    case 'pac':
      this.setPreference('network.proxy.autoconfig_url', proxy.autoconfigUrl);
      break;
  }
};

// private
FirefoxProfile.prototype._writeUserPrefs = function (userPrefs) {
  var content = '';
  Object.keys(userPrefs).forEach(function (val) {
    content = content + 'user_pref("' + val + '", ' + userPrefs[val] + ');\n';
  });
  fs.writeFileSync(this.userPrefs, content); // defaults to utf8 (node 0.8 compat)
};

FirefoxProfile.prototype._readExistingUserjs = function () {
  var self = this,
    regExp = /user_pref\(['"](.*)["'],\s*(.*)\)/,
    contentLines = fs.readFileSync(this.userPrefs, 'utf8').split('\n');
  contentLines.forEach(function (line) {
    var found = line.match(regExp);
    if (found) {
      self.defaultPreferences[found[1]] = found[2];
    }
  });
};

FirefoxProfile.prototype._installExtension = function (addon, cb) {
  // from python... not needed. specify full path instead when calling addExtension
  // if (addon === config.WEBDRIVER_EXT) {
  //   addon = path.join(__dirname, config.WEBDRIVER_EXT);
  // }
  var tmpDir = null, // to unzip xpi
    xpiFile = null,
    self = this;

  if (addon.slice(-4) === '.xpi') {
    tmpDir = this._createTempFolder(addon.split(path.sep).pop());
    var zip = new AdmZip(addon);
    zip.extractAllTo(tmpDir, true);
    xpiFile = addon;
    addon = tmpDir;
  }

  // find out the addon id
  this._addonDetails(addon, function (addonDetails) {
    var addonId = getID(addonDetails);
    var unpack = addonDetails.unpack === undefined ? true : addonDetails.unpack;

    if (!addonId) {
      cb(new Error('FirefoxProfile: the addon id could not be found!'));
    }
    var addonPath = path.join(self.extensionsDir, path.sep, addonId);
    util.callbackify(async function run() {
      await fs.mkdirp(self.extensionsDir);
      if (!unpack && xpiFile) {
        await fs.copy(xpiFile, addonPath + '.xpi');
      } else {
        await fs.mkdir(addonPath);
        await fs.copy(addon, addonPath, {
          clobber: true,
        });
      }

      if (tmpDir) {
        await fs.remove(tmpDir);
      }

      return addonDetails;
    })(cb);
  });
};

FirefoxProfile.prototype._addonDetails = function (addonPath, cb) {
  var details = {
      id: null,
      name: null,
      unpack: true,
      version: null,
      isNative: false,
    },
    self = this;

  function getNamespaceId(doc, url) {
    var namespaces = doc[Object.keys(doc)[0]].$,
      pref = null;
    Object.keys(namespaces).forEach(function (prefix) {
      if (namespaces[prefix] === url) {
        pref = prefix.replace('xmlns:', '');
        return false;
      }
    });
    return pref;
  }

  // Attempt to parse the `install.rdf` inside the extension
  var doc;
  try {
    doc = fs.readFileSync(path.join(addonPath, 'install.rdf'));
  } catch (e) {
    // If not found, this is probably a webextension, so parse
    // the `manifest.json` file for addon details
    try {
      var webExtManifest = JSON.parse(
        fs.readFileSync(path.join(addonPath, 'manifest.json'))
      );
      details.unpack = false;

      webExtManifest = webExtManifest || {};

      // browser specific id takes precedence over the old-style
      // `applications.gecko.id`
      // see: https://bugzilla.mozilla.org/show_bug.cgi?id=1255564
      details.id = (
        (webExtManifest.browser_specific_settings || {}).gecko || {}
      ).id;
      if (!details.id) {
        details.id = ((webExtManifest.applications || {}).gecko || {}).id;
      }

      details.name = webExtManifest.name;
      details.version = webExtManifest.version;
      cb && cb(details);
      return;
    } catch (e) {
      // still not found, maybe this is a jetpack style addon, so parse the
      // `package.json.json` file for addon details
      var manifest = require(path.join(addonPath, 'package.json'));

      // Jetpack addons are packed by default
      details.unpack = false;
      details.isNative = true;
      Object.keys(details).forEach(function (prop) {
        if (manifest[prop] !== undefined) {
          details[prop] = manifest[prop];
        }
      });

      cb && cb(details);
      return;
    }
  }

  parseString(doc, function (err, doc) {
    var em = getNamespaceId(doc, 'http://www.mozilla.org/2004/em-rdf#'),
      rdf = getNamespaceId(doc, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    // first description
    var rdfNode = unprefix(doc, 'RDF', rdf);
    var description = unprefix(rdfNode, 'Description', rdf);

    if (description && description[0]) {
      description = description[0];
    }
    Object.keys(description.$).forEach(function (attr) {
      if (details[attr.replace(em + ':', '')] !== undefined) {
        details[attr.replace(em + ':', '')] = description.$[attr];
      }
    });
    Object.keys(description).forEach(function (attr) {
      if (details[attr.replace(em + ':', '')] !== undefined) {
        // to convert boolean strings into booleans
        details[attr.replace(em + ':', '')] = self._sanitizePref(
          description[attr][0]
        );
      }
    });

    cb && cb(details);
  });
};

FirefoxProfile.prototype._createTempFolder = function (prefix) {
  // Don't use an empty string for `prefix` or it might not work on some CIs (Travis)
  return (
    fs.mkdtempSync(path.resolve(os.tmpdir(), prefix || 'firefox-profile')) + '/'
  );
};

FirefoxProfile.prototype._sanitizePref = function (val) {
  if (val === 'true') {
    return true;
  }
  if (val === 'false') {
    return false;
  } else {
    return val;
  }
};

FirefoxProfile.prototype._setManualProxyPreference = function (key, setting) {
  if (!setting || setting === '') {
    return;
  }
  var hostDetails = setting.split(':');
  this.setPreference('network.proxy.' + key, hostDetails[0]);
  if (hostDetails[1]) {
    this.setPreference(
      'network.proxy.' + key + '_port',
      parseInt(hostDetails[1], 10)
    );
  }
};

FirefoxProfile.Finder = Finder;

module.exports = FirefoxProfile;
