"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const linetransform_1 = __importDefault(require("../../linetransform"));
const protocol_1 = __importDefault(require("../../protocol"));
const parser_1 = __importDefault(require("../../parser"));
const command_1 = __importDefault(require("../../command"));
class ScreencapCommand extends command_1.default {
    execute() {
        this._send('shell:echo && screencap -p 2>/dev/null');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    let transform = new linetransform_1.default();
                    return this.parser
                        .readBytes(1)
                        .then((chunk) => {
                        transform = new linetransform_1.default({ autoDetect: true });
                        transform.write(chunk);
                        return this.parser.raw().pipe(transform);
                    })
                        .catch(parser_1.default.PrematureEOFError, () => {
                        throw Error('No support for the screencap command');
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = ScreencapCommand;
//# sourceMappingURL=screencap.js.map