"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sort_object_keys_1 = __importDefault(require("sort-object-keys"));
var sort_order_1 = __importDefault(require("sort-order"));
var PRE_OR_POST_PREFIX = /^(pre|post)/;
var NPM_RUN_ALL_SEPARATOR = /([:/])/;
var NPM_BUILTIN_SCRIPTS = ['install', 'prepare', 'pack', 'publish', 'restart', 'start', 'stop', 'test', 'version', 'uninstall'];
;
function parseScriptName(scripts, original) {
    // prepublishOnly is a script whose base event is publish.
    // cf. https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-publish
    if (original === 'prepublishOnly') {
        return { prefix: 'pre', base: 'publish', original: original };
    }
    var prefixMatch = PRE_OR_POST_PREFIX.exec(original);
    var prefix = prefixMatch ? prefixMatch[0] : undefined;
    var base = prefix ? original.slice(prefix.length) : original;
    if ((scripts === null || scripts === void 0 ? void 0 : scripts.hasOwnProperty(base)) || NPM_BUILTIN_SCRIPTS.includes(base)) {
        return { prefix: prefix, base: base, original: original };
    }
    return { prefix: undefined, base: original, original: original };
}
// Sort alphabetically by script name excluding pre/post prefixes
function scriptName(scripts) {
    return function (a, b) {
        var aParsed = parseScriptName(scripts, a);
        var bParsed = parseScriptName(scripts, b);
        // For example, for an input name `prettier:lint`, the segments would be `['prettier', ':', 'lint']`.
        // The segments contains separators. There are two types of separators, to determine their order.
        var aSegments = aParsed.base.split(NPM_RUN_ALL_SEPARATOR);
        var bSegments = bParsed.base.split(NPM_RUN_ALL_SEPARATOR);
        var aLength = aSegments.length;
        var bLength = bSegments.length;
        // Compare each segment, and when the strings are different, return 1 or -1 in alphabetical order.
        for (var i = 0; i < Math.min(aLength, bLength); i++) {
            if (aSegments[i] !== bSegments[i]) {
                return aSegments[i] < bSegments[i] ? -1 : 1;
            }
        }
        // Compare segments length, return 1 or -1 in ascending order of length.
        if (aLength !== bLength) {
            return aLength < bLength ? -1 : 1;
        }
        return 0;
    };
}
// Sort by pre, script, post
function prePostHooks(scripts) {
    return function (a, b) {
        var aParsed = parseScriptName(scripts, a);
        var bParsed = parseScriptName(scripts, b);
        if (aParsed.prefix === 'pre' || bParsed.prefix === 'post') {
            return -1;
        }
        else if (aParsed.prefix === 'post' || bParsed.prefix === 'pre') {
            return 1;
        }
        else if (aParsed.base !== bParsed.base) {
            return aParsed.base < bParsed.base ? -1 : 1;
        }
        return 0;
    };
}
function sortScripts(scripts) {
    var keys = Object.keys(scripts || {});
    var order = (0, sort_order_1["default"])(scriptName(scripts), prePostHooks(scripts));
    return keys.length === 0 ? {} : { scripts: (0, sort_object_keys_1["default"])(scripts, keys.sort(order)) };
}
exports["default"] = sortScripts;
