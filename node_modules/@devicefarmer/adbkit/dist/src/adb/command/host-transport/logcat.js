"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const linetransform_1 = __importDefault(require("../../linetransform"));
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
// FIXME(intentional any): not "any" will break it all
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class LogcatCommand extends command_1.default {
    execute(options = {}) {
        let cmd;
        // For some reason, LG G Flex requires a filter spec with the -B option.
        // It doesn't actually use it, though. Regardless of the spec we always get
        // all events on all devices.
        cmd = 'logcat -B *:I 2>/dev/null';
        if (options.clear) {
            cmd = `logcat -c 2>/dev/null && ${cmd}`;
        }
        this._send(`shell:echo && ${cmd}`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.raw().pipe(new linetransform_1.default({
                        autoDetect: true,
                    }));
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = LogcatCommand;
//# sourceMappingURL=logcat.js.map