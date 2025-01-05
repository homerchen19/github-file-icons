"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOBase = void 0;
const common_tags_1 = require("common-tags");
const const_1 = require("./const");
/*
 * Base class for io operations for both an Xpi or a directory.
 */
class IOBase {
    constructor({ filePath, stderr }) {
        this.path = filePath;
        this.stderr = stderr;
        this.files = {};
        this.entries = [];
        // If this is too large the node process will hit a RangeError
        // when it runs out of memory.
        this.maxSizeBytes = 1024 * 1024 * const_1.MAX_FILE_SIZE_MB;
        // A callback that accepts a relative file path and returns
        // true if the path should be included in results for scanning.
        this.shouldScanFile = () => true;
    }
    setScanFileCallback(callback) {
        if (typeof callback === 'function') {
            this.shouldScanFile = callback;
        }
    }
    getFile(path, fileStreamType = 'string') {
        switch (fileStreamType) {
            case 'stream':
                return this.getFileAsStream(path);
            case 'string':
                return this.getFileAsString(path);
            case 'chunk':
                // Assuming that chunk is going to be primarily used for finding magic
                // numbers in files, then there's no need to have the default be longer
                // than that.
                return this.getChunkAsBuffer(path, const_1.FLAGGED_FILE_MAGIC_NUMBERS_LENGTH);
            default:
                throw new Error((0, common_tags_1.oneLine) `Unexpected fileStreamType
          value "${fileStreamType}" should be one of "string",
          "stream"`);
        }
    }
    getFilesByExt(...extensions) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < extensions.length; i++) {
                const ext = extensions[i];
                if (ext.indexOf('.') !== 0) {
                    throw new Error("File extension must start with '.'");
                }
            }
            const filesObject = yield this.getFiles();
            const files = [];
            Object.keys(filesObject).forEach((filename) => {
                extensions.forEach((ext) => {
                    if (filename.endsWith(ext)) {
                        files.push(filename);
                    }
                });
            });
            return files;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
    getFiles(optionalArgument) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('getFiles is not implemented');
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getFileAsStream(path) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('getFileAsStream is not implemented');
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getFileAsString(path) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('getFileAsString is not implemented');
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getChunkAsBuffer(path, chunkLength) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('getChunkAsBuffer is not implemented');
        });
    }
    close() {
        // noop
    }
}
exports.IOBase = IOBase;
