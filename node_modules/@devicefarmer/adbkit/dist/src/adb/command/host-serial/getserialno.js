"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../command"));
const protocol_1 = __importDefault(require("../../protocol"));
class GetSerialNoCommand extends command_1.default {
    execute(serial) {
        this._send(`host-serial:${serial}:get-serialno`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readValue().then((value) => value.toString());
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = GetSerialNoCommand;
//# sourceMappingURL=getserialno.js.map