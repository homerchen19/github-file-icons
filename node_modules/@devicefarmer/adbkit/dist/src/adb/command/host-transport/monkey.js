"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
class MonkeyCommand extends command_1.default {
    execute(port) {
        // Some devices have broken /sdcard (i.e. /mnt/sdcard), which monkey will
        // attempt to use to write log files to. We can cheat and set the location
        // with an environment variable, because most logs use
        // Environment.getLegacyExternalStorageDirectory() like they should. There
        // are some hardcoded logs, though. Anyway, this should enable most things.
        // Check https://github.com/android/platform_frameworks_base/blob/master/
        // core/java/android/os/Environment.java for the variables.
        this._send(`shell:EXTERNAL_STORAGE=/data/local/tmp monkey --port ${port} -v`);
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    // The monkey command is a bit weird in that it doesn't look like
                    // it starts in daemon mode, but it actually does. So even though
                    // the command leaves the terminal "hanging", Ctrl-C (or just
                    // ending the connection) will not end the daemon. HOWEVER, on
                    // some devices, such as SO-02C by Sony, it is required to leave
                    // the command hanging around. In any case, if the command exits
                    // by itself, it means that something went wrong.
                    // On some devices (such as F-08D by Fujitsu), the monkey
                    // command gives no output no matter how many verbose flags you
                    // give it. So we use a fallback timeout.
                    return this.parser
                        .searchLine(/^:Monkey:/)
                        .timeout(1000)
                        .then(() => {
                        return this.parser.raw();
                    })
                        .catch(bluebird_1.default.TimeoutError, () => {
                        return this.parser.raw();
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = MonkeyCommand;
//# sourceMappingURL=monkey.js.map