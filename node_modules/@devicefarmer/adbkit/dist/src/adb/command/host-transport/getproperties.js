"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
const RE_KEYVAL = /^\[([\s\S]*?)\]: \[([\s\S]*?)\]\r?$/gm;
// FIXME(intentional any): not "any" will break it all
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class GetPropertiesCommand extends command_1.default {
    execute() {
        this._send('shell:getprop');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readAll().then((data) => {
                        return this._parseProperties(data.toString());
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
    _parseProperties(value) {
        const properties = {};
        let match;
        while ((match = RE_KEYVAL.exec(value))) {
            properties[match[1]] = match[2];
        }
        return properties;
    }
}
exports.default = GetPropertiesCommand;
//# sourceMappingURL=getproperties.js.map