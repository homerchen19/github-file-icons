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
exports.checkFileExists = exports.walkPromise = exports.readdir = exports.readFile = exports.lstat = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const upath_1 = __importDefault(require("upath"));
exports.lstat = (0, util_1.promisify)(fs_1.default.lstat);
exports.readFile = (0, util_1.promisify)(fs_1.default.readFile);
exports.readdir = (0, util_1.promisify)(fs_1.default.readdir);
function walkPromise(curPath, { shouldIncludePath = () => true, stderr }) {
    const result = {};
    // Set a basePath var with the initial path so all file paths (the result
    // keys) can be relative to the starting point.
    const basePath = curPath;
    const walk = function walk(_curPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const stat = yield (0, exports.lstat)(_curPath);
            const relPath = upath_1.default.toUnix(path_1.default.relative(basePath, _curPath));
            if (!shouldIncludePath(relPath, stat.isDirectory())) {
                stderr.debug(`Skipping file path: ${relPath}`);
            }
            else if (stat.isFile()) {
                const { size } = stat;
                result[relPath] = { size };
            }
            else if (stat.isDirectory()) {
                const files = yield (0, exports.readdir)(_curPath);
                // Map the list of files and make a list of readdir promises to pass to
                // Promise.all so we can recursively get the data on all the files in the
                // directory.
                yield Promise.all(files.map((fileName) => __awaiter(this, void 0, void 0, function* () {
                    yield walk(path_1.default.join(_curPath, fileName));
                })));
            }
            return result;
        });
    };
    return walk(curPath);
}
exports.walkPromise = walkPromise;
function checkFileExists(filePath, { _lstat = exports.lstat } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const invalidMessage = new Error(`Path "${filePath}" is not a file or directory or does not exist.`);
        try {
            const stats = yield _lstat(filePath);
            if (stats.isFile() === true || stats.isDirectory() === true) {
                return stats;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
        throw invalidMessage;
    });
}
exports.checkFileExists = checkFileExists;
