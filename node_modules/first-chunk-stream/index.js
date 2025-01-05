'use strict';
const {Duplex: DuplexStream} = require('stream');

class FirstChunkStream extends DuplexStream {
	constructor(options = {}, callback) {
		const state = {
			sent: false,
			chunks: [],
			size: 0
		};

		if (typeof callback !== 'function') {
			throw new TypeError('FirstChunkStream constructor requires a callback as its second argument.');
		}

		if (typeof options.chunkLength !== 'number') {
			throw new TypeError('FirstChunkStream constructor requires `options.chunkLength` to be a number.');
		}

		if (options.objectMode) {
			throw new Error('FirstChunkStream doesn\'t support `objectMode` yet.');
		}

		super(options);

		// Initialize the internal state
		state.manager = createReadStreamBackpressureManager(this);

		// Errors management
		// We need to execute the callback or emit en error dependending on the fact
		// the firstChunk is sent or not
		state.errorHandler = error => {
			processCallback(error, Buffer.concat(state.chunks, state.size), state.encoding);
		};

		this.on('error', state.errorHandler);

		// Callback management
		const processCallback = (error, buffer, encoding, done = () => {}) => {
			// When doing sync writes + emitting an errror it can happen that
			// Remove the error listener on the next tick if an error where fired
			// to avoid unwanted error throwing
			if (error) {
				setImmediate(() => this.removeListener('error', state.errorHandler));
			} else {
				this.removeListener('error', state.errorHandler);
			}

			state.sent = true;

			callback(error, buffer, encoding, (error, buffer, encoding) => {
				if (error) {
					setImmediate(() => this.emit('error', error));
					return;
				}

				if (!buffer) {
					done();
					return;
				}

				state.manager.programPush(buffer, encoding, done);
			});
		};

		// Writes management
		this._write = (chunk, encoding, done) => {
			state.encoding = encoding;

			if (state.sent) {
				state.manager.programPush(chunk, state.encoding, done);
			} else if (chunk.length < options.chunkLength - state.size) {
				state.chunks.push(chunk);
				state.size += chunk.length;
				done();
			} else {
				state.chunks.push(chunk.slice(0, options.chunkLength - state.size));
				chunk = chunk.slice(options.chunkLength - state.size);
				state.size += state.chunks[state.chunks.length - 1].length;

				processCallback(null, Buffer.concat(state.chunks, state.size), state.encoding, () => {
					if (chunk.length === 0) {
						done();
						return;
					}

					state.manager.programPush(chunk, state.encoding, done);
				});
			}
		};

		this.on('finish', () => {
			if (!state.sent) {
				return processCallback(null, Buffer.concat(state.chunks, state.size), state.encoding, () => {
					state.manager.programPush(null, state.encoding);
				});
			}

			state.manager.programPush(null, state.encoding);
		});
	}
}

// Utils to manage readable stream backpressure
function createReadStreamBackpressureManager(readableStream) {
	const manager = {
		waitPush: true,
		programmedPushs: [],
		programPush(chunk, encoding, isDone = () => {}) {
			// Store the current write
			manager.programmedPushs.push([chunk, encoding, isDone]);
			// Need to be async to avoid nested push attempts
			// Programm a push attempt
			setImmediate(manager.attemptPush);
			// Let's say we're ready for a read
			readableStream.emit('readable');
			readableStream.emit('drain');
		},
		attemptPush() {
			let nextPush;

			if (manager.waitPush) {
				if (manager.programmedPushs.length > 0) {
					nextPush = manager.programmedPushs.shift();
					manager.waitPush = readableStream.push(nextPush[0], nextPush[1]);
					(nextPush[2])();
				}
			} else {
				setImmediate(() => {
					// Need to be async to avoid nested push attempts
					readableStream.emit('readable');
				});
			}
		}
	};

	function streamFilterRestoreRead() {
		manager.waitPush = true;
		// Need to be async to avoid nested push attempts
		setImmediate(manager.attemptPush);
	}

	// Patch the readable stream to manage reads
	readableStream._read = streamFilterRestoreRead;

	return manager;
}

module.exports = FirstChunkStream;
