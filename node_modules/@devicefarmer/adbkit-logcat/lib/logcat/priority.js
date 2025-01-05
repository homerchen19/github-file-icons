"use strict";
var codes = {
    UNKNOWN: 0,
    DEFAULT: 1,
    VERBOSE: 2,
    DEBUG: 3,
    INFO: 4,
    WARN: 5,
    ERROR: 6,
    FATAL: 7,
    SILENT: 8
};
var names = {
    0: 'UNKNOWN',
    1: 'DEFAULT',
    2: 'VERBOSE',
    3: 'DEBUG',
    4: 'INFO',
    5: 'WARN',
    6: 'ERROR',
    7: 'FATAL',
    8: 'SILENT'
};
var letters = {
    '?': codes.UNKNOWN,
    V: codes.VERBOSE,
    D: codes.DEBUG,
    I: codes.INFO,
    W: codes.WARN,
    E: codes.ERROR,
    F: codes.FATAL,
    S: codes.SILENT
};
var letterNames = {
    0: '?',
    1: '?',
    2: 'V',
    3: 'D',
    4: 'I',
    5: 'W',
    6: 'E',
    7: 'F',
    8: 'S'
};
var Priority = /** @class */ (function () {
    function Priority() {
    }
    Priority.fromName = function (name) {
        var value = codes[name.toUpperCase()];
        if (value || value === 0) {
            return value;
        }
        return Priority.fromLetter(name);
    };
    Priority.toName = function (value) {
        return names[value];
    };
    Priority.fromLetter = function (letter) {
        return letters[letter.toUpperCase()];
    };
    Priority.toLetter = function (value) {
        return letterNames[value];
    };
    Priority.UNKNOWN = codes.UNKNOWN;
    Priority.DEFAULT = codes.DEFAULT;
    Priority.VERBOSE = codes.VERBOSE;
    Priority.DEBUG = codes.DEBUG;
    Priority.INFO = codes.INFO;
    Priority.WARN = codes.WARN;
    Priority.ERROR = codes.ERROR;
    Priority.FATAL = codes.FATAL;
    Priority.SILENT = codes.SILENT;
    return Priority;
}());
module.exports = Priority;
