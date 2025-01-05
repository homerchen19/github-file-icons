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
var binary_1 = __importDefault(require("./parser/binary"));
var transform_1 = __importDefault(require("./transform"));
var priority_1 = __importDefault(require("./priority"));
var Reader = /** @class */ (function (_super) {
    __extends(Reader, _super);
    function Reader(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.parser = new binary_1.default();
        _this.stream = null;
        var defaults = {
            format: 'binary',
            fixLineFeeds: true,
            priority: priority_1.default.DEBUG
        };
        _this.options = Object.assign({}, defaults, options);
        _this.filters = {
            all: -1,
            tags: {}
        };
        if (_this.options.format !== 'binary') {
            throw new Error("Unsupported format '".concat(_this.options.format, "'"));
        }
        return _this;
    }
    Reader.prototype.exclude = function (tag) {
        if (tag === Reader.ANY) {
            return this.excludeAll();
        }
        this.filters.tags[tag] = priority_1.default.SILENT;
        return this;
    };
    Reader.prototype.excludeAll = function () {
        this.filters.all = priority_1.default.SILENT;
        return this;
    };
    Reader.prototype.include = function (tag, priority) {
        if (priority === void 0) { priority = this.options.priority; }
        if (tag === Reader.ANY) {
            return this.includeAll(priority);
        }
        this.filters.tags[tag] = this._priority(priority);
        return this;
    };
    Reader.prototype.includeAll = function (priority) {
        if (priority === void 0) { priority = this.options.priority; }
        this.filters.all = this._priority(priority);
        return this;
    };
    Reader.prototype.resetFilters = function () {
        this.filters.all = -1;
        this.filters.tags = {};
        return this;
    };
    Reader.prototype._hook = function () {
        var _this = this;
        if (this.options.fixLineFeeds) {
            var transform = this.stream.pipe(new transform_1.default());
            transform.on('data', function (data) {
                _this.parser.parse(data);
            });
        }
        else {
            this.stream.on('data', function (data) {
                _this.parser.parse(data);
            });
        }
        this.stream.on('error', function (err) {
            _this.emit('error', err);
        });
        this.stream.on('end', function () {
            _this.emit('end');
        });
        this.stream.on('finish', function () {
            _this.emit('finish');
        });
        this.parser.on('entry', function (entry) {
            if (_this._filter(entry)) {
                _this.emit('entry', entry);
            }
        });
        this.parser.on('error', function (err) {
            _this.emit('error', err);
        });
    };
    Reader.prototype._filter = function (entry) {
        var wanted = entry.tag in this.filters.tags
            ? this.filters.tags[entry.tag]
            : this.filters.all;
        return entry.priority >= wanted;
    };
    Reader.prototype._priority = function (priority) {
        return typeof priority === 'number' ? priority : priority_1.default.fromName(priority);
    };
    Reader.prototype.connect = function (stream) {
        this.stream = stream;
        this._hook();
        return this;
    };
    Reader.prototype.end = function () {
        this.stream.end();
        return this;
    };
    Reader.ANY = '*';
    return Reader;
}(events_1.EventEmitter));
module.exports = Reader;
