"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
class ClearCommand extends command_1.default {
    execute(pkg) {
        this._send(`shell:pm clear ${pkg}`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser
                        .searchLine(/^(Success|Failed)$/)
                        .finally(() => {
                        return this.parser.end();
                    })
                        .then(function (result) {
                        switch (result[0]) {
                            case 'Success':
                                return true;
                            case 'Failed':
                                // Unfortunately, the command may stall at this point and we
                                // have to kill the connection.
                                throw new Error(`Package '${pkg}' could not be cleared`);
                        }
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
exports.default = ClearCommand;
//# sourceMappingURL=clear.js.map