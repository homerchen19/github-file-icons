"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
class ReverseCommand extends command_1.default {
    execute(remote, local) {
        this._send(`reverse:forward:${remote};${local}`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readAscii(4).then((reply) => {
                        switch (reply) {
                            case protocol_1.default.OKAY:
                                return true;
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
exports.default = ReverseCommand;
//# sourceMappingURL=reverse.js.map