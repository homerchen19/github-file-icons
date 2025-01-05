"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("../../command"));
const protocol_1 = __importDefault(require("../../protocol"));
const RE_FEATURE = /^feature:(.*?)(?:=(.*?))?\r?$/gm;
class GetFeaturesCommand extends command_1.default {
    execute() {
        this._send('shell:pm list features 2>/dev/null');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readAll().then((data) => {
                        return this._parseFeatures(data.toString());
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
    _parseFeatures(value) {
        const features = {};
        let match;
        while ((match = RE_FEATURE.exec(value))) {
            features[match[1]] = match[2] || true;
        }
        return features;
    }
}
exports.default = GetFeaturesCommand;
//# sourceMappingURL=getfeatures.js.map