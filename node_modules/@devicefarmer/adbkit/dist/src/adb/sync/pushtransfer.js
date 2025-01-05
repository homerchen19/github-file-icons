"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class PushTransfer extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this._stack = [];
        this.stats = {
            bytesTransferred: 0,
        };
    }
    cancel() {
        return this.emit('cancel');
    }
    push(byteCount) {
        return this._stack.push(byteCount);
    }
    pop() {
        const byteCount = this._stack.pop();
        if (byteCount) {
            this.stats.bytesTransferred += byteCount;
        }
        return this.emit('progress', this.stats);
    }
    end() {
        return this.emit('end');
    }
}
exports.default = PushTransfer;
//# sourceMappingURL=pushtransfer.js.map