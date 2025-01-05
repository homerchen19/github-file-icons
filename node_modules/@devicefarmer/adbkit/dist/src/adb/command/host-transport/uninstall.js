"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
class UninstallCommand extends command_1.default {
    execute(pkg) {
        this._send(`shell:pm uninstall ${pkg}`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser
                        .searchLine(/^(Success|Failure.*|.*Unknown package:.*)$/)
                        .then(function (match) {
                        if (match[1] === 'Success') {
                            return true;
                        }
                        else {
                            // Either way, the package was uninstalled or doesn't exist,
                            // which is good enough for us.
                            return true;
                        }
                    })
                        .finally(() => {
                        // Consume all remaining content to "naturally" close the
                        // connection.
                        return this.parser.readAll();
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = UninstallCommand;
//# sourceMappingURL=uninstall.js.map