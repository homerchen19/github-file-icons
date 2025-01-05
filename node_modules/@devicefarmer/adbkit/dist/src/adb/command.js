"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("./protocol"));
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('adb:command');
const RE_SQUOT = /'/g;
const RE_ESCAPE = /([$`\\!"])/g;
class Command {
    constructor(connection) {
        this.connection = connection;
        this.parser = this.connection.parser;
        this.protocol = protocol_1.default;
    }
    _send(data) {
        const encoded = protocol_1.default.encodeData(data);
        if (debug.enabled) {
            debug(`Send '${encoded}'`);
        }
        this.connection.write(encoded);
        return this;
    }
    _escape(arg) {
        switch (typeof arg) {
            case 'number':
                return arg;
            default:
                return "'" + arg.toString().replace(RE_SQUOT, "'\"'\"'") + "'";
        }
    }
    _escapeCompat(arg) {
        switch (typeof arg) {
            case 'number':
                return arg;
            default:
                return '"' + arg.toString().replace(RE_ESCAPE, '\\$1') + '"';
        }
    }
}
exports.default = Command;
//# sourceMappingURL=command.js.map