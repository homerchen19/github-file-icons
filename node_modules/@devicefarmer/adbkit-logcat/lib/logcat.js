"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var reader_1 = __importDefault(require("./logcat/reader"));
var priority_1 = __importDefault(require("./logcat/priority"));
var Logcat = /** @class */ (function () {
    function Logcat() {
    }
    Logcat.readStream = function (stream, options) {
        return new reader_1.default(options).connect(stream);
    };
    Logcat.Reader = reader_1.default;
    Logcat.Priority = priority_1.default;
    return Logcat;
}());
module.exports = Logcat;
