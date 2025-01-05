/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { Duplex } from 'stream';
import { ReaderOptions } from '../ReaderOptions';
declare class Reader extends EventEmitter {
    private options?;
    static ANY: string;
    private parser;
    private stream;
    private filters;
    constructor(options?: ReaderOptions);
    exclude(tag: string): Reader;
    excludeAll(): Reader;
    include(tag: string, priority?: number): Reader;
    includeAll(priority?: number): Reader;
    resetFilters(): Reader;
    private _hook;
    private _filter;
    private _priority;
    connect(stream: Duplex): Reader;
    end(): Reader;
}
export = Reader;
