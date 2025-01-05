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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Directory = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const first_chunk_stream_1 = __importDefault(require("first-chunk-stream"));
const strip_bom_stream_1 = __importDefault(require("strip-bom-stream"));
const common_tags_1 = require("common-tags");
const base_1 = require("./base");
const utils_1 = require("./utils");
class Directory extends base_1.IOBase {
    constructor({ filePath, stderr }) {
        super({ filePath, stderr });
        this.files = {};
    }
    getFiles(_walkPromise = utils_1.walkPromise) {
        return __awaiter(this, void 0, void 0, function* () {
            // If we have already processed this directory and have data on this
            // instance return that.
            if (Object.keys(this.files).length) {
                this.stderr.debug((0, common_tags_1.oneLine) `Files already exist for directory
        "${this.path}" returning cached data`);
                return this.files;
            }
            const files = yield _walkPromise(this.path, {
                shouldIncludePath: (_path, isDirectory) => {
                    return this.shouldScanFile(_path, isDirectory);
                },
                stderr: this.stderr,
            });
            this.files = files;
            this.entries = Object.keys(files);
            return files;
        });
    }
    getPath(_path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.prototype.hasOwnProperty.call(this.files, _path)) {
                throw new Error(`Path "${_path}" does not exist in this dir.`);
            }
            if (this.files[_path].size > this.maxSizeBytes) {
                throw new Error(`File "${_path}" is too large. Aborting`);
            }
            const absoluteDirPath = path_1.default.resolve(this.path);
            const filePath = path_1.default.resolve(path_1.default.join(absoluteDirPath, _path));
            // This is belt and braces. Should never happen that a file was in
            // the files object and yet doesn't meet these requirements.
            if (!filePath.startsWith(absoluteDirPath) || _path.startsWith('/')) {
                throw new Error(`Path argument must be relative to ${this.path}`);
            }
            return filePath;
        });
    }
    getFileAsStream(_path, { encoding } = { encoding: 'utf8' }) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = yield this.getPath(_path);
            const readStream = (0, fs_1.createReadStream)(filePath, {
                autoClose: true,
                encoding,
                flags: 'r',
            });
            return !encoding ? readStream : readStream.pipe((0, strip_bom_stream_1.default)());
        });
    }
    getFileAsString(_path) {
        return __awaiter(this, void 0, void 0, function* () {
            const readStream = yield this.getFileAsStream(_path);
            return new Promise((resolve, reject) => {
                let content = '';
                readStream.on('readable', () => {
                    let chunk;
                    // eslint-disable-next-line no-cond-assign
                    while ((chunk = readStream.read()) !== null) {
                        content += chunk.toString();
                    }
                });
                readStream.on('end', () => {
                    resolve(content);
                });
                readStream.on('error', reject);
            });
        });
    }
    getChunkAsBuffer(_path, chunkLength) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = yield this.getPath(_path);
            return new Promise((resolve, reject) => {
                const readStream = (0, fs_1.createReadStream)(filePath, {
                    flags: 'r',
                    // This is important because you don't want to encode the bytes if you
                    // are doing a binary check.
                    encoding: '',
                    autoClose: true,
                });
                readStream.on('error', reject);
                readStream.pipe(new first_chunk_stream_1.default({ chunkLength }, (_, enc) => {
                    resolve(enc);
                }));
            });
        });
    }
}
exports.Directory = Directory;
