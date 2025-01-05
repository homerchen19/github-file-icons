"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../command"));
const protocol_1 = __importDefault(require("../../protocol"));
class GetPackagesCommand extends command_1.default {
    execute(flags) {
        if (flags) {
            this._send(`shell:pm list packages ${flags} 2>/dev/null`);
        }
        else {
            this._send('shell:pm list packages 2>/dev/null');
        }
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readAll().then((data) => {
                        return this._parsePackages(data.toString());
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
    _parsePackages(value) {
        const packages = [];
        const RE_PACKAGE = /^package:(.*?)\r?$/gm;
        while (true) {
            const match = RE_PACKAGE.exec(value);
            if (match) {
                packages.push(match[1]);
            }
            else {
                break;
            }
        }
        return packages;
    }
}
exports.default = GetPackagesCommand;
//# sourceMappingURL=getpackages.js.map