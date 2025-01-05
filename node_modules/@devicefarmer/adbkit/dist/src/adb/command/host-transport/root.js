"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
const RE_OK = /restarting adbd as root/;
class RootCommand extends command_1.default {
    execute() {
        this._send('root:');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readAll().then(function (value) {
                        if (RE_OK.test(value.toString())) {
                            return true;
                        }
                        else {
                            throw new Error(value.toString().trim());
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
exports.default = RootCommand;
//# sourceMappingURL=root.js.map