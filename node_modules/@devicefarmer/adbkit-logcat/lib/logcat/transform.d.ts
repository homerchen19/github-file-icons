/// <reference types="node" />
/// <reference types="node" />
import { Transform as OriginalTransform, TransformCallback } from 'stream';
declare class Transform extends OriginalTransform {
    private savedR;
    _transform(chunk: Buffer, encoding: BufferEncoding, done: TransformCallback): void;
}
export = Transform;
