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
var stream_1 = require("stream");
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.savedR = null;
        return _this;
    }
    // Sadly, the ADB shell is not very smart. It automatically converts every
    // 0x0a ('\n') it can find to 0x0d 0x0a ('\r\n'). This also applies to binary
    // content. We could get rid of this behavior by setting `stty raw`, but
    // unfortunately it's not available by default (you'd have to install busybox)
    // or something similar. On the up side, it really does do this for all line
    // feeds, so a simple transform works fine.
    Transform.prototype._transform = function (chunk, encoding, done) {
        var lo = 0;
        var hi = 0;
        if (this.savedR) {
            if (chunk[0] !== 0x0a) {
                this.push(this.savedR);
            }
            this.savedR = null;
        }
        var last = chunk.length - 1;
        while (hi <= last) {
            if (chunk[hi] === 0x0d) {
                if (hi === last) {
                    this.savedR = chunk.slice(last);
                    break; // Stop hi from incrementing, we want to skip the last byte.
                }
                else if (chunk[hi + 1] === 0x0a) {
                    this.push(chunk.slice(lo, hi));
                    lo = hi + 1;
                }
            }
            hi += 1;
        }
        if (hi !== lo) {
            this.push(chunk.slice(lo, hi));
        }
        done();
    };
    return Transform;
}(stream_1.Transform));
module.exports = Transform;
