"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeZipFile = exports.createFakeFsStats = exports.readStringFromStream = exports.createFakeStderr = exports.createFakeStdout = void 0;
const yauzl_1 = require("yauzl");
const createFakeStdout = () => {
    return {
        write: jest.fn(),
    };
};
exports.createFakeStdout = createFakeStdout;
const createFakeStderr = () => {
    return {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    };
};
exports.createFakeStderr = createFakeStderr;
const readStringFromStream = (readStream, encoding) => {
    return new Promise((resolve, reject) => {
        let content = '';
        readStream.on('readable', () => {
            let chunk;
            // eslint-disable-next-line no-cond-assign
            while ((chunk = readStream.read()) !== null) {
                content += chunk.toString(encoding);
            }
        });
        readStream.on('end', () => {
            resolve(content);
        });
        readStream.on('error', reject);
    });
};
exports.readStringFromStream = readStringFromStream;
const createFakeFsStats = ({ isFile = false, isDirectory = false, } = {}) => {
    return {
        isDirectory: () => isDirectory,
        isFile: () => isFile,
    };
};
exports.createFakeFsStats = createFakeFsStats;
class FakeRandomAccessReader extends yauzl_1.RandomAccessReader {
}
const createFakeZipFile = ({ autoClose = true, centralDirectoryOffset = 0, comment = '', decodeStrings = true, 
// This is set to `1` to avoid an error with `RandomAccessReader.unref()`
// because we are using a `FakeRandomAccessReader`
entryCount = 1, fileSize = 0, 
// This is set to `true` to avoid an error due to the ZipFile trying to
// automatically load the entries (because `entryCount = 1` above).
lazyEntries = true, reader = new FakeRandomAccessReader(), validateEntrySizes = true, } = {}) => {
    return new yauzl_1.ZipFile(reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, lazyEntries, decodeStrings, validateEntrySizes);
};
exports.createFakeZipFile = createFakeZipFile;
