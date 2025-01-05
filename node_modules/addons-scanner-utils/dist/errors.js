"use strict";
/* eslint-disable max-classes-per-file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateZipEntryError = exports.InvalidZipFileError = void 0;
class InvalidZipFileError extends Error {
    get name() {
        return 'InvalidZipFileError';
    }
}
exports.InvalidZipFileError = InvalidZipFileError;
class DuplicateZipEntryError extends Error {
    get name() {
        return 'DuplicateZipFileEntry';
    }
}
exports.DuplicateZipEntryError = DuplicateZipEntryError;
