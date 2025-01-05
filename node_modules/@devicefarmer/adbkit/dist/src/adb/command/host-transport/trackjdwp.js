"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
const jdwptracker_1 = __importDefault(require("../../jdwptracker"));
class TrackJdwpCommand extends command_1.default {
    execute() {
        this._send('track-jdwp');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return new jdwptracker_1.default(this);
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = TrackJdwpCommand;
//# sourceMappingURL=trackjdwp.js.map