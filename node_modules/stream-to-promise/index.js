'use strict'

const toArray = require('stream-to-array')
const Promise = require('any-promise')
const onEnd = require('end-of-stream')

module.exports = streamToPromise

async function streamToPromise (stream) {
  if (stream.readable) return fromReadable(stream)
  if (stream.writable) return fromWritable(stream)
}

async function fromReadable (stream) {
  const promise = toArray(stream)

  // Ensure stream is in flowing mode
  if (stream.resume) stream.resume()

  const parts = await promise

  if (stream._readableState && stream._readableState.objectMode) {
    return parts
  }

  return Buffer.concat(parts.map(bufferize))
}

async function fromWritable (stream) {
  return new Promise(function (resolve, reject) {
    onEnd(stream, function (err) {
      (err ? reject : resolve)(err)
    })
  })
}

function bufferize (chunk) {
  return Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
}
