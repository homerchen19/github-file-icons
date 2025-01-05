'use strict';
const isUtf8 = require('is-utf8');

module.exports = buffer => {
	if (!Buffer.isBuffer(buffer)) {
		throw new TypeError(`Expected a Buffer, got ${typeof buffer}`);
	}

	if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF && isUtf8(buffer)) {
		return buffer.slice(3);
	}

	return buffer;
};
