"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceMap {
    constructor() {
        this.remotes = Object.create(null);
        this.count = 0;
    }
    end() {
        const ref = this.remotes;
        for (const remoteId in ref) {
            const remote = ref[remoteId];
            remote.end();
        }
        this.remotes = Object.create(null);
        this.count = 0;
    }
    insert(remoteId, socket) {
        if (this.remotes[remoteId]) {
            throw new Error(`Remote ID ${remoteId} is already being used`);
        }
        else {
            this.count += 1;
            return (this.remotes[remoteId] = socket);
        }
    }
    get(remoteId) {
        return this.remotes[remoteId] || null;
    }
    remove(remoteId) {
        let remote;
        if ((remote = this.remotes[remoteId])) {
            delete this.remotes[remoteId];
            this.count -= 1;
            return remote;
        }
        else {
            return null;
        }
    }
}
exports.default = ServiceMap;
//# sourceMappingURL=servicemap.js.map