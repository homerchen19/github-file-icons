"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RollingCounter {
    constructor(max, min = 1) {
        this.max = max;
        this.min = min;
        this.now = this.min;
    }
    next() {
        if (!(this.now < this.max)) {
            this.now = this.min;
        }
        return ++this.now;
    }
}
exports.default = RollingCounter;
//# sourceMappingURL=rollingcounter.js.map