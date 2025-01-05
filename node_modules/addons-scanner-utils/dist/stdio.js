"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInMemoryStdout = exports.createConsoleStdout = exports.createInMemoryStderr = exports.createConsoleStderr = void 0;
// Logs (for humans) should be sent to `stderr` so that we can pipe the
// `stdout` output to other tools. Verbosity is controlled by the
// `verboseLevel` argument (and the number of `-v` passed to the CLI).
//
// By default, only errors are shown.
const createConsoleStderr = ({ _console = console, programName, verboseLevel = 0, }) => {
    const logWithPrefix = (message) => {
        _console.error(`${programName}: ${message}`);
    };
    const stderr = {
        error(message) {
            if (verboseLevel >= 0) {
                logWithPrefix(message);
            }
        },
        info(message) {
            if (verboseLevel >= 1) {
                logWithPrefix(message);
            }
        },
        debug(message) {
            if (verboseLevel >= 2) {
                logWithPrefix(message);
            }
        },
    };
    return stderr;
};
exports.createConsoleStderr = createConsoleStderr;
const createInMemoryStderr = () => {
    return {
        messages: {
            debug: [],
            error: [],
            info: [],
        },
        debug(message) {
            this.messages.debug.push(message);
        },
        error(message) {
            this.messages.error.push(message);
        },
        info(message) {
            this.messages.info.push(message);
        },
    };
};
exports.createInMemoryStderr = createInMemoryStderr;
// `stdout` should be used for final outputs, and usually once at the end of
// the command.
const createConsoleStdout = ({ _console = console } = {}) => {
    return {
        write(message) {
            _console.log(message);
        },
    };
};
exports.createConsoleStdout = createConsoleStdout;
const createInMemoryStdout = () => {
    return {
        output: '',
        write(message) {
            this.output = message;
        },
    };
};
exports.createInMemoryStdout = createInMemoryStdout;
