import {
	Duplex as DuplexStream,
	DuplexOptions as DuplexStreamOption
} from 'stream';

declare namespace FirstChunkStream {
	interface Options extends Readonly<DuplexStreamOption> {
		/**
		How many bytes you want to buffer.
		*/
		readonly chunkLength: number;
	}

	type TransformFunction = (
		error: Error | null,
		chunk: Buffer,
		encoding: string,
		callback: (error?: Error | null, buffer?: string | Buffer | Uint8Array, encoding?: string) => void
	) => void;
}

declare class FirstChunkStream extends DuplexStream {
	/**
	Buffer and transform the `n` first bytes of a stream.

	@param options - The options object is passed to the [`Duplex` stream](https://nodejs.org/api/stream.html#stream_class_stream_duplex) constructor allowing you to customize your stream behavior.
	@param transform - The function that gets the required `options.chunkLength` bytes.

	Note that the buffer can have a smaller length than the required one. In that case, it will be due to the fact that the complete stream contents has a length less than the `options.chunkLength` value. You should check for this yourself if you strictly depend on the length.

	@example
	```
	import * as fs from 'fs';
	import getStream = require('get-stream');
	import FirstChunkStream = require('first-chunk-stream');

	// unicorn.txt => unicorn rainbow
	const stream = fs.createReadStream('unicorn.txt')
		.pipe(new FirstChunkStream({chunkLength: 7}, (error, chunk, encoding, callback) => {
			if (error) {
				callback(error);
				return;
			}

			callback(null, chunk.toString(encoding).toUpperCase());
		}));

	(async () => {
		const data = await getStream(stream);

		if (data.length < 7) {
			throw new Error('Couldn\'t get the minimum required first chunk length');
		}

		console.log(data);
		//=> 'UNICORN rainbow'
	})();
	```
	*/
	constructor(
		options: FirstChunkStream.Options,
		transform: FirstChunkStream.TransformFunction
	);
}

export = FirstChunkStream;
