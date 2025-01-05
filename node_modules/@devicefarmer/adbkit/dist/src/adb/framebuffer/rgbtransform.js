"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const assert_1 = __importDefault(require("assert"));
const stream_1 = require("stream");
class RgbTransform extends stream_1.Stream.Transform {
    constructor(meta, options) {
        super(options);
        this.meta = meta;
        this._buffer = Buffer.from('');
        assert_1.default.ok(this.meta.bpp === 24 || this.meta.bpp === 32, 'Only 24-bit and 32-bit raw images with 8-bits per color are supported');
        this._r_pos = this.meta.red_offset / 8;
        this._g_pos = this.meta.green_offset / 8;
        this._b_pos = this.meta.blue_offset / 8;
        this._a_pos = this.meta.alpha_offset / 8;
        this._pixel_bytes = this.meta.bpp / 8;
    }
    _transform(chunk, encoding, done) {
        if (this._buffer.length) {
            this._buffer = Buffer.concat([this._buffer, chunk], this._buffer.length + chunk.length);
        }
        else {
            this._buffer = chunk;
        }
        let sourceCursor = 0;
        let targetCursor = 0;
        const target = this._pixel_bytes === 3 ? this._buffer : Buffer.alloc(Math.max(4, (chunk.length / this._pixel_bytes) * 3));
        while (this._buffer.length - sourceCursor >= this._pixel_bytes) {
            const r = this._buffer[sourceCursor + this._r_pos];
            const g = this._buffer[sourceCursor + this._g_pos];
            const b = this._buffer[sourceCursor + this._b_pos];
            target[targetCursor + 0] = r;
            target[targetCursor + 1] = g;
            target[targetCursor + 2] = b;
            sourceCursor += this._pixel_bytes;
            targetCursor += 3;
        }
        if (targetCursor) {
            this.push(target.slice(0, targetCursor));
            this._buffer = this._buffer.slice(sourceCursor);
        }
        done();
    }
}
module.exports = RgbTransform;
//# sourceMappingURL=rgbtransform.js.map