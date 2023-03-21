"use strict";
/**
 * Sort and filter files field
 *
 * More info:
 *   https://docs.npmjs.com/files/package.json#files
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var minimatch_1 = __importDefault(require("minimatch"));
var not = function (filterFn) { return function (arg) { return !filterFn(arg); }; };
var or = function () {
    var filterFns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filterFns[_i] = arguments[_i];
    }
    return function (arg) { return filterFns.some(function (fn) { return fn(arg); }); };
};
var ALWAYS_INCLUDED = [
    /^package.json$/,
    /^README.*/i,
    /^CHANGE(S|LOG).*/i,
    /^HISTORY.*/i,
    /^LICEN(C|S)E.*/i,
    /^NOTICE.*/i
]
    .map(function (regex) { return function (filepath) { return regex.test(filepath); }; })
    .reduce(function (a, b) { return or(a, b); });
var ALWAYS_EXCLUDED = [
    '.git',
    'CVS',
    '.svn',
    '.hg',
    '.lock-wscript',
    '.wafpickle-N',
    '.*.swp',
    '.DS_Store',
    '._*',
    'npm-debug.log',
    '.npmrc',
    'node_modules',
    'config.gypi',
    '*.orig',
    'package-lock.json'
]
    .map(function (glob) { return minimatch_1["default"].filter(glob); })
    .reduce(function (a, b) { return or(a, b); });
function sortFiles(packageJson) {
    var _a = packageJson.files, files = _a === void 0 ? [] : _a, main = packageJson.main;
    var isPackageMain = function (filepath) { return filepath === main; };
    var ignored = or(ALWAYS_INCLUDED, ALWAYS_EXCLUDED, isPackageMain);
    var directoriesFirst = function (a, b) {
        if (a.endsWith('/') && !b.endsWith('/')) {
            return -1;
        }
        else if (!a.endsWith('/') && b.endsWith('/')) {
            return 1;
        }
        else {
            return 0;
        }
    };
    var exclusionsLast = function (a, b) {
        if (a.startsWith('!') && !b.startsWith('!')) {
            return 1;
        }
        else if (!a.startsWith('!') && b.startsWith('!')) {
            return -1;
        }
        else {
            return 0;
        }
    };
    var sortedAndFilteredFiles = files.filter(not(ignored)).sort().sort(directoriesFirst).sort(exclusionsLast);
    return sortedAndFilteredFiles.length > 0 ? { files: sortedAndFilteredFiles } : {};
}
exports["default"] = sortFiles;
