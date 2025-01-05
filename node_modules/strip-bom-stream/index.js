'use strict';
const FirstChunkStream = require('first-chunk-stream');
const stripBomBuffer = require('strip-bom-buf');

module.exports = () =>
	new FirstChunkStream({chunkLength: 3}, (error, chunk, encoding, callback) => {
		if (error) {
			callback(error);
			return;
		}

		callback(null, stripBomBuffer(chunk));
	});
