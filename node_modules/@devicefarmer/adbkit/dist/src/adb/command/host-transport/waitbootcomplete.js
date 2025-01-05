"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
class WaitBootCompleteCommand extends command_1.default {
    execute() {
        this._send('shell:while getprop sys.boot_completed 2>/dev/null; do sleep 1; done');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser
                        .searchLine(/^1$/)
                        .finally(() => this.parser.end())
                        .then(() => true);
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = WaitBootCompleteCommand;
//# sourceMappingURL=waitbootcomplete.js.map