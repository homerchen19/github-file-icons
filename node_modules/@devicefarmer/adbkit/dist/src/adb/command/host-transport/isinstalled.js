"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const parser_1 = __importDefault(require("../../parser"));
const command_1 = __importDefault(require("../../command"));
class IsInstalledCommand extends command_1.default {
    execute(pkg) {
        this._send(`shell:pm path ${pkg} 2>/dev/null`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser
                        .readAscii(8)
                        .then((reply) => {
                        switch (reply) {
                            case 'package:':
                                return true;
                            default:
                                return this.parser.unexpected(reply, "'package:'");
                        }
                    })
                        .catch(parser_1.default.PrematureEOFError, function () {
                        return false;
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = IsInstalledCommand;
//# sourceMappingURL=isinstalled.js.map