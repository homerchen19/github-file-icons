/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
declare class Binary extends EventEmitter {
    private buffer;
    parse(chunk: Buffer): void;
    private _processEntry;
}
export = Binary;
