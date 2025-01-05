"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../command"));
const protocol_1 = __importDefault(require("../../protocol"));
class HostVersionCommand extends command_1.default {
    execute() {
        this._send('host:version');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readValue().then((value) => {
                        return this._parseVersion(value.toString());
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this._parseVersion(reply);
            }
        });
    }
    _parseVersion(version) {
        return parseInt(version, 16);
    }
}
exports.default = HostVersionCommand;
//# sourceMappingURL=version.js.map