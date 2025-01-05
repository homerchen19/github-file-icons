/// <reference types="node" />
import Reader from './logcat/reader';
import Priority from './logcat/priority';
import { Duplex } from 'stream';
import { ReaderOptions } from './ReaderOptions';
declare class Logcat {
    static Reader: typeof Reader;
    static Priority: typeof Priority;
    static readStream(stream: Duplex, options: ReaderOptions): Reader;
}
export = Logcat;
