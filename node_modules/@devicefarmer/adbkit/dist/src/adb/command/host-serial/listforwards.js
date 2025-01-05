"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../command"));
const protocol_1 = __importDefault(require("../../protocol"));
class ListForwardsCommand extends command_1.default {
    execute(serial) {
        this._send(`host-serial:${serial}:list-forward`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readValue().then(this._parseForwards);
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
    _parseForwards(value) {
        return value
            .toString()
            .split('\n')
            .filter((e) => e)
            .map((forward) => {
            const [serial, local, remote] = forward.split(/\s+/);
            return { serial, local, remote };
        });
    }
}
exports.default = ListForwardsCommand;
//# sourceMappingURL=listforwards.js.map