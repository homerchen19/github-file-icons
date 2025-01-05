"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../command"));
const protocol_1 = __importDefault(require("../../protocol"));
class HostDevicesCommand extends command_1.default {
    execute() {
        this._send('host:devices');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this._readDevices();
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
    _readDevices() {
        return this.parser.readValue().then(this._parseDevices);
    }
    _parseDevices(value) {
        return value
            .toString('ascii')
            .split('\n')
            .filter((e) => e)
            .map((line) => {
            const [id, type] = line.split('\t');
            return {
                id,
                type: type,
            };
        });
    }
}
exports.default = HostDevicesCommand;
//# sourceMappingURL=devices.js.map