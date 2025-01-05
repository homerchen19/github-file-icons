/// <reference types="node"/>

/**
Strip UTF-8 [byte order mark](http://en.wikipedia.org/wiki/Byte_order_mark#UTF-8) (BOM) from a buffer.

@example
```
import * as fs from 'fs';
import stripBomBuffer = require('strip-bom-buf');

stripBomBuffer(fs.readFileSync('unicorn.txt'));
//=> 'unicorn'
```
*/
declare function stripBomBuffer(buffer: Buffer): Buffer;

export = stripBomBuffer;
