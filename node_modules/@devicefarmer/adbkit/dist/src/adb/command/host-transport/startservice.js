"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const startactivity_1 = __importDefault(require("./startactivity"));
class StartServiceCommand extends startactivity_1.default {
    execute(options) {
        const args = this._intentArgs(options);
        if (options.user || options.user === 0) {
            args.push('--user', this._escape(options.user));
        }
        return this._run('startservice', args);
    }
}
exports.default = StartServiceCommand;
//# sourceMappingURL=startservice.js.map