#!/usr/bin/env node
var minimist = require('minimist'),
  util = require('util'),
  fs = require('fs'),
  FirefoxProfile = require('./firefox_profile');

var argv = minimist(process.argv.slice(2), {
  string: [
  'o', 'output',
  'p', 'profile',
  'c', 'copy'],
  boolean: [
  'v', 'verbose',
  'h', 'help'
  ]
});

function displayHelp() {
  console.log('usage: firefox-profile [-v] [-p profilename || -c profile_dir] [-e extension_path1 [-e extension_path2]] [-o destination_dir || --ouput destination_dir || -b [file_path] || --base64 [file_path]]');
  console.log('');
  console.log('-v: verbose mode (same as --verbose)');
  console.log('-h: show this message (same as --help)');
  console.log('-p profilename: profile to copy (same as --profile)');
  console.log('-c profile_dir: profile folder path to copy (same as --copy)');
  console.log('-e extension_path: file path to extension to add to the profile. Can be present multiple times (same as --extension)');
  console.log('-o destination_dir (or --output destination_dir): folder where the profile will be created.');
  console.log('-b [file_path](or --base64): write the encoded firefox profile to stdout or to file_path if specified.');
}

if (argv.h || argv.help) {
  displayHelp();
  process.exit(0);
}

function displayError(msg, err) {
  console.error('ERROR:', msg, err);
}

var destinationDirectory = argv.o || argv.ouput,
    encoded = argv.b || argv.base64;

if (!destinationDirectory && !encoded) {
  console.log('ERROR: you need to specify a destination directory (-o or --output) or ouput the encoded profile to stdout (-b64 or --base64)\n');
  displayHelp();
  process.exit(1);
}

var verbose = !!(argv.v || argv.verbose),
  profileName = argv.p || argv.profile,
  profileDirectory = argv.c || argv.copy,
  extensionPaths = (argv.e || []).concat(argv.extension || []);


function log() {
  if (verbose) {
    console.log.apply(null, arguments);
  }
}
log('arguments:', argv);

// copy or create a new profile depending on params
// TODO: use async instead?
function createProfile(cb) {
  if (profileName || profileDirectory) {
    var copyMethod = argv.p ? 'copyFromUserProfile' : 'copy',
      copyOptions = {
        destinationDirectory: destinationDirectory,
        name: profileName,
        profileDirectory: profileDirectory
      };
    log(util.format('calling FirefoxProfile.`%s` method with options %s', copyMethod, JSON.stringify(copyOptions)));
    FirefoxProfile[copyMethod](copyOptions, function(err, fp) {
      cb(err, fp);
    });
    return;

  }
  log('creating an empty profile...');
  cb(null, new FirefoxProfile({
    destinationDirectory: destinationDirectory
  }));
}


createProfile(function(err, fp) {
  if (err) {
    displayError('cannot copy the profile', err);
    process.exit(2);
  }

  if (typeof extensionPaths === 'string') {
    extensionPaths = [extensionPaths];
  }
  // still not an array? it should be ok to call addExtensions with empty array...
  if (!Array.isArray(extensionPaths)) {
    extensionPaths = [];
  }
  log('adding extensions::', extensionPaths);
  fp.addExtensions(extensionPaths, function(err) {
    if (err) {
      displayError('unable to add extensions', err);
      process.exit(2);
    }
    if (!encoded) {
      // we're done
      fp.updatePreferences();
      console.log('profile created in', fp.profileDir);
      process.exit(0);
    }
    log('encoding profile...');

    fp.encoded(function(err, zippedProfileString) {
      if (err) {
        console.error('oops, an error occured:', err);
        process.exit(4);
      }
      if (encoded === true) {
        process.stdout.write(zippedProfileString);
        process.exit(0);
      }
      log('writing encoded profile to file', encoded);
      fs.writeFile(encoded, zippedProfileString, function (err) {
        if (err)  {
          displayError('unable to write encoded profile', err);
          process.exit(3);
        }
        process.exit(0);
      })
    });
  });


});
