"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const tracker_1 = __importDefault(require("../../tracker"));
const devices_1 = __importDefault(require("./devices"));
class HostTrackDevicesCommand extends devices_1.default {
    // FIXME(intentional any): correct return value: `Bluebird<Tracker>`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute() {
        this._send('host:track-devices');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return new tracker_1.default(this);
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = HostTrackDevicesCommand;
//# sourceMappingURL=trackdevices.js.map