"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.check = exports.format = void 0;
var cosmiconfig_1 = require("cosmiconfig");
var sort_object_keys_1 = __importDefault(require("sort-object-keys"));
var defaultOptions_1 = require("./defaultOptions");
var sort_dependencies_1 = __importDefault(require("./sort-dependencies"));
var sort_contributors_1 = __importDefault(require("./sort-contributors"));
var sort_files_1 = __importDefault(require("./sort-files"));
var sort_scripts_1 = __importDefault(require("./sort-scripts"));
function format(packageJson, opts) {
    var options = getConfig(opts);
    var json = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, packageJson), (0, sort_contributors_1["default"])('author', packageJson, opts)), (0, sort_contributors_1["default"])('maintainers', packageJson, __assign(__assign({}, opts), { enforceMultiple: true }))), (0, sort_contributors_1["default"])('contributors', packageJson, __assign(__assign({}, opts), { enforceMultiple: true }))), sort('man', packageJson)), sort('bin', packageJson)), (0, sort_files_1["default"])(packageJson)), sort('directories', packageJson)), (0, sort_scripts_1["default"])(packageJson.scripts)), sort('config', packageJson)), (0, sort_dependencies_1["default"])('optionalDependencies', packageJson)), (0, sort_dependencies_1["default"])('dependencies', packageJson)), (0, sort_dependencies_1["default"])('bundleDependencies', packageJson)), (0, sort_dependencies_1["default"])('bundledDependencies', packageJson)), (0, sort_dependencies_1["default"])('peerDependencies', packageJson)), (0, sort_dependencies_1["default"])('devDependencies', packageJson)), sort('keywords', packageJson)), sort('engines', packageJson)), sort('os', packageJson)), sort('cpu', packageJson)), sort('publishConfig', packageJson));
    return stringify((0, sort_object_keys_1["default"])(json, options.keyOrder), options);
}
exports.format = format;
function check(packageJson, opts) {
    try {
        var options = getConfig(opts);
        var object = typeof packageJson === 'string' ? JSON.parse(packageJson) : packageJson;
        var formatted = format(object, options);
        return stringify(object, options) === formatted;
    }
    catch (e) {
        return false;
    }
}
exports.check = check;
function getConfig(options) {
    var explorer = (0, cosmiconfig_1.cosmiconfigSync)('prettier-package-json');
    var result = explorer.search();
    return __assign(__assign(__assign({}, defaultOptions_1.defaultOptions), result === null || result === void 0 ? void 0 : result.config), options);
}
function stringify(object, options) {
    var space = options.useTabs ? '\t' : options.tabWidth;
    return JSON.stringify(object, null, space) + '\n';
}
function sort(key, packageJson) {
    var _a, _b;
    var input = packageJson[key];
    if (Array.isArray(input)) {
        return input.length === 0 ? {} : (_a = {}, _a[key] = input.sort(), _a);
    }
    if (typeof input === 'object') {
        var keys = Object.keys(input);
        return keys.length === 0 ? {} : (_b = {}, _b[key] = (0, sort_object_keys_1["default"])(input, keys.sort()), _b);
    }
    return {};
}
