import FirstChunkStream = require('first-chunk-stream');

declare namespace stripBomStream {
	type StripBomStream = FirstChunkStream;
}

/**
Strip UTF-8 [byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark#UTF-8) (BOM) from a stream.

@example
```
import * as fs from 'fs';
import stripBomStream = require('strip-bom-stream');

fs.createReadStream('unicorn.txt')
	.pipe(stripBomStream())
	.pipe(fs.createWriteStream('unicorn.txt'));
```
*/
declare function stripBomStream(): stripBomStream.StripBomStream;

export = stripBomStream;
