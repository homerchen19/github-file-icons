var fs = require('fs');
var path = require('path');
var asyncLib = require('async');
var Zip = require('jszip');

// Limiting the number of files read at the same time
var maxOpenFiles = 500;

module.exports = function zipWrite (rootDir, options, callback) {
  var promise, succeed, fail;

  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  if (!callback) {
    promise = new Promise(function (resolve, reject) {
      succeed = resolve;
      fail = reject;
    });
  }

  zipBuffer(rootDir, options, function (err, buffer) {
    if (!err && options.saveTo) {
      fs.writeFile(options.saveTo, buffer, { encoding: 'binary' }, function (err) {
        finish(err);
      });
    } else {
      finish(err);
    }

    function finish (err) {
      if (callback) {
        callback(err, buffer);
      } else {
        if (err) {
          fail(err);
        } else {
          succeed(buffer);
        }
      }
    }
  });

  return promise;
};

function zipBuffer (rootDir, options, callback) {
  var zip = new Zip();
  var folders = {};
  // Resolve the path so we can remove trailing slash if provided
  rootDir = path.resolve(rootDir);

  folders[rootDir] = zip;

  dive(rootDir, function (err) {
    if (err) return callback(err);

    zip.generateAsync({
      compression: 'DEFLATE',
      type: 'nodebuffer'
    }).then(function (buffer) {
      callback(null, buffer);
    }).catch(function (error) {
      callback(error);
    });
  });

  function dive (dir, callback) {
    fs.readdir(dir, function (err, files) {
      if (err) return callback(err);
      if (!files.length) return callback();
      var count = files.length;
      files.forEach(function (file) {
        var fullPath = path.resolve(dir, file);
        addItem(fullPath, function (err) {
          if (!--count) {
            callback(err);
          }
        });
      });
    });
  }

  var fileQueue = asyncLib.queue(function (task, callback) {
    fs.readFile(task.fullPath, function (err, data) {
      if (options.each) {
        options.each(path.join(task.dir, task.file));
      }
      folders[task.dir].file(task.file, data);
      callback(err);
    });
  }, maxOpenFiles);

  function addItem (fullPath, cb) {
    fs.stat(fullPath, function (err, stat) {
      if (err) return cb(err);
      if (options.filter && !options.filter(fullPath, stat)) return cb();
      var dir = path.dirname(fullPath);
      var file = path.basename(fullPath);
      var parentZip;
      if (stat.isDirectory()) {
        parentZip = folders[dir];
        if (options.each) {
          options.each(fullPath);
        }
        folders[fullPath] = parentZip.folder(file);
        dive(fullPath, cb);
      } else {
        fileQueue.push({ fullPath: fullPath, dir: dir, file: file }, cb);
      }
    });
  }
}
