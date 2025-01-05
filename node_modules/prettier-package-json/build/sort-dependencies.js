"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sort_object_keys_1 = __importDefault(require("sort-object-keys"));
function order(a, b) {
    return a.localeCompare(b, 'en');
}
function sortDependencies(key, packageJson) {
    var _a;
    var dependencies = packageJson[key];
    var keys = Object.keys(dependencies || {});
    return keys.length === 0 ? {} : (_a = {}, _a[key] = (0, sort_object_keys_1["default"])(dependencies, keys.sort(order)), _a);
}
exports["default"] = sortDependencies;
