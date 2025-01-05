'use strict';

var os   = require('os'),
    fs   = require('fs'),
    path = require('path'),

    ini = require('ini');


function locateUserDirectory(platform) {
  var userDir;
  switch (platform || os.platform()) {
    case 'darwin':
      userDir = path.join(process.env.HOME, '/Library/Application Support/Firefox');
      break;
    case 'linux':
      userDir = path.join(process.env.HOME, '/.mozilla/firefox');
      break;
    case 'win32':
      userDir = path.join(process.env.APPDATA, '/Mozilla/Firefox');
      break;
  }
  return userDir;
}

/**
 * ProfileFinder constructor
 *
 * @params directory String optional - the user directory that contains `profiles.ini` file.
 * It uses ProfileFinder.locateUserDirectory() if not provided
 */
function ProfileFinder(directory) {
  this.directory = directory || ProfileFinder.locateUserDirectory();
  this.hasReadProfiles = false;
  this.profiles = [];
}

/**
 * returns default user profile folder
 *
 */
ProfileFinder.locateUserDirectory = locateUserDirectory;


/**
 * Reads profiles info and stores it in this.profiles.
 *
 * @params function cb - callbabk(err, profiles)
 *
 */
ProfileFinder.prototype.readProfiles = function(cb) {
  if (this.hasReadProfiles) { cb(null, this.profiles); }

  var self = this;
  fs.readFile(path.join(this.directory, 'profiles.ini'), {encoding: 'utf8'}, function(err, data) {
    if (err) { cb(err); }
    Object.entries(ini.parse(data)).forEach(function ([key, value]) {
      if (typeof key === 'string' && key.match(/^Profile/)) {
        self.profiles.push(value);
      }
    });
    self.hasReadProfiles = true;
    cb(null, self.profiles);
  });
};

/**
 * returns the path to the requested profile
 *
 * @params String name - the name of the requested profile
 * @params function cb - callbabk(err, profiles)
 *
 */
ProfileFinder.prototype.getPath = function(name, cb) {
  var self = this;
  function findInProfiles(name, cb) {
    var pathFound,
        found = self.profiles.find(function(profile) {
      return profile.Name === name;
    });
    if (found) {
      pathFound = found.IsRelative ? path.join(self.directory, found.Path) : found.Path;
    }
    cb && cb(found ? null : new Error('cannot find profile ' + name), pathFound);
    return pathFound;
  }
  if (!this.hasReadProfiles) {
    this.readProfiles(function() {
      findInProfiles(name, cb);
    });
    return;
  }
  return findInProfiles(name, cb);
};

module.exports = ProfileFinder;
