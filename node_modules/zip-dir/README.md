# zip-dir

Zips up a directory and saves the zip to disk or returns as a buffer.

[![Build Status](http://img.shields.io/travis/jsantell/node-zip-dir.svg?style=flat-square)](https://travis-ci.org/jsantell/node-zip-dir)
[![Build Status](http://img.shields.io/npm/v/zip-dir.svg?style=flat-square)](https://www.npmjs.org/package/zip-dir)

## install

```
$ npm install zip-dir
```

## example

```javascript
var zipdir = require('zip-dir');

// `buffer` is the buffer of the zipped file
var buffer = await zipdir('/path/to/be/zipped');

zipdir('/path/to/be/zipped', function (err, buffer) {
  // `buffer` is the buffer of the zipped file
});

zipdir('/path/to/be/zipped', { saveTo: '~/myzip.zip' }, function (err, buffer) {
  // `buffer` is the buffer of the zipped file
  // And the buffer was saved to `~/myzip.zip`
});

// Use a filter option to prevent zipping other zip files!
// Keep in mind you have to allow a directory to descend into!
zipdir('/path/to/be/zipped', { filter: (path, stat) => !/\.zip$/.test(path) }, function (err, buffer) {
  
});

// Use an `each` option to call a function everytime a file is added, and receives the path
zipdir('/path/to/be/zipped', { each: path => console.log(p, "added!"), function (err, buffer) {

});
  
```

## methods

```
var zipdir = require('zip-dir');
```

### zipdir(dirPath, [options], [callback]) : [Promise]

Zips up `dirPath` recursively preserving directory structure and returns
the compressed buffer on success. If the `callback` function is supplied, it will be called with `(error, buffer)` once the `zipdir` function is done. If not, the buffer or an error can be obtained from the returned promise. The `callback` and the promise are mutually exclusive. If `options` defined with a `saveTo` path, then the callback and promise will be delayed until the buffer has also
been saved to disk.

#### Options

* `saveTo` A path to save the buffer to.
* `filter` A function that is called for all items to determine whether or not they should be added to the zip buffer. Function is called with the `fullPath` and a `stats` object ([fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats)). Return true to add the item; false otherwise. To include files within directories, directories must also pass this filter.
* `each` A function that is called everytime a file or directory is added to the zip.

## TODO

* Add an option to not add empty directories if there are no valid children inside

## license

MIT
