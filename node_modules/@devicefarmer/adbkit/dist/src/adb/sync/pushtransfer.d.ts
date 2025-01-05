/// <reference types="node" />
import { EventEmitter } from 'events';
export default class PushTransfer extends EventEmitter {
    private _stack;
    stats: {
        bytesTransferred: number;
    };
    cancel(): boolean;
    push(byteCount: number): number;
    pop(): boolean;
    end(): boolean;
}
//# sourceMappingURL=pushtransfer.d.ts.map