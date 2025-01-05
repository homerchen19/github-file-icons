"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("../../protocol"));
const sync_1 = __importDefault(require("../../sync"));
const command_1 = __importDefault(require("../../command"));
class SyncCommand extends command_1.default {
    execute() {
        this._send('sync:');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return new sync_1.default(this.connection);
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
}
exports.default = SyncCommand;
//# sourceMappingURL=sync.js.map