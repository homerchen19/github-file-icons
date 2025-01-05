"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = __importDefault(require("./parser"));
const auth_1 = __importDefault(require("./auth"));
class Util {
    static readAll(stream, callback) {
        return new parser_1.default(stream).readAll().nodeify(callback);
    }
    static parsePublicKey(keyString, callback) {
        return auth_1.default.parsePublicKey(keyString).nodeify(callback);
    }
}
exports.default = Util;
//# sourceMappingURL=util.js.map