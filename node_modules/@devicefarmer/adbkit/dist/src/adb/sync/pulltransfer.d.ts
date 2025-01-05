/// <reference types="node" />
import { Stream } from 'stream';
export default class PullTransfer extends Stream.PassThrough {
    stats: {
        bytesTransferred: number;
    };
    cancel(): boolean;
    write(chunk: Buffer, encoding?: BufferEncoding | typeof callback, callback?: (error: Error | null | undefined) => void): boolean;
}
//# sourceMappingURL=pulltransfer.d.ts.map