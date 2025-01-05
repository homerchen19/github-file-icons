"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../command"));
const protocol_1 = __importDefault(require("../../protocol"));
class HostDevicesWithPathsCommand extends command_1.default {
    execute() {
        this._send('host:devices-l');
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
            // For some reason, the columns are separated by spaces instead of tabs
            const [id, type, path, product, model, device, transportId] = line.split(/\s+/);
            return {
                id,
                type: type,
                path,
                product,
                model,
                device,
                transportId,
            };
        });
    }
}
exports.default = HostDevicesWithPathsCommand;
//# sourceMappingURL=deviceswithpaths.js.map