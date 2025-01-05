"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
class WaitForDeviceCommand extends command_1.default {
    execute(serial) {
        this._send(`host-serial:${serial}:wait-for-any-device`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readAscii(4).then((reply) => {
                        switch (reply) {
                            case protocol_1.default.OKAY:
                                return serial;
                            case protocol_1.default.FAIL:
                                return this.parser.readError();
                            default:
                                return this.parser.unexpected(reply, 'OKAY or FAIL');
                        }
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = WaitForDeviceCommand;
//# sourceMappingURL=waitfordevice.js.map