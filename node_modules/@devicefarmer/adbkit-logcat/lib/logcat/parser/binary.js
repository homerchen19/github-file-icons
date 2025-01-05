"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var events_1 = require("events");
var entry_1 = __importDefault(require("../entry"));
var HEADER_SIZE_V1 = 20;
var HEADER_SIZE_MAX = 100;
var Binary = /** @class */ (function (_super) {
    __extends(Binary, _super);
    function Binary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buffer = new Buffer(0);
        return _this;
    }
    Binary.prototype.parse = function (chunk) {
        this.buffer = Buffer.concat([this.buffer, chunk]);
        while (this.buffer.length > 4) {
            var cursor = 0;
            var length = this.buffer.readUInt16LE(cursor);
            cursor += 2;
            var headerSize = this.buffer.readUInt16LE(cursor);
            // On v1, headerSize SHOULD be 0, but isn't on some devices. Attempt to
            // avoid that situation by discarding values that are obviously incorrect.
            if (headerSize < HEADER_SIZE_V1 || headerSize > HEADER_SIZE_MAX) {
                headerSize = HEADER_SIZE_V1;
            }
            cursor += 2;
            if (this.buffer.length < headerSize + length) {
                break;
            }
            var entry = new entry_1.default();
            entry.setPid(this.buffer.readInt32LE(cursor));
            cursor += 4;
            entry.setTid(this.buffer.readInt32LE(cursor));
            cursor += 4;
            var sec = this.buffer.readInt32LE(cursor);
            cursor += 4;
            var nsec = this.buffer.readInt32LE(cursor);
            entry.setDate(new Date(sec * 1000 + nsec / 1000000));
            cursor += 4;
            // Make sure that we don't choke if new fields are added
            cursor = headerSize;
            var data = this.buffer.slice(cursor, cursor + length);
            cursor += length;
            this.buffer = this.buffer.slice(cursor);
            this._processEntry(entry, data);
        }
        if (this.buffer.length) {
            this.emit('wait');
        }
        else {
            this.emit('drain');
        }
    };
    Binary.prototype._processEntry = function (entry, data) {
        entry.setPriority(data[0]);
        var cursor = 1;
        while (cursor < data.length) {
            if (data[cursor] === 0) {
                entry.setTag(data.slice(1, cursor).toString());
                entry.setMessage(data.slice(cursor + 1, data.length - 1).toString());
                this.emit('entry', entry);
                return;
            }
            cursor += 1;
        }
        this.emit('error', new Error("Unprocessable entry data '".concat(data, "'")));
    };
    return Binary;
}(events_1.EventEmitter));
module.exports = Binary;
