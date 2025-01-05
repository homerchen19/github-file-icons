"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class PullTransfer extends stream_1.Stream.PassThrough {
    constructor() {
        super(...arguments);
        this.stats = {
            bytesTransferred: 0,
        };
    }
    cancel() {
        return this.emit('cancel');
    }
    write(chunk, encoding, callback) {
        this.stats.bytesTransferred += chunk.length;
        this.emit('progress', this.stats);
        if (typeof encoding === 'function') {
            return super.write(chunk, encoding);
        }
        return super.write(chunk, encoding, callback);
    }
}
exports.default = PullTransfer;
//# sourceMappingURL=pulltransfer.js.map