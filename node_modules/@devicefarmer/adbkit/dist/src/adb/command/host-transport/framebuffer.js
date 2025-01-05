"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const debug_1 = __importDefault(require("debug"));
const rgbtransform_1 = __importDefault(require("../../framebuffer/rgbtransform"));
const protocol_1 = __importDefault(require("../../protocol"));
const command_1 = __importDefault(require("../../command"));
const debug = (0, debug_1.default)('adb:command:framebuffer');
// FIXME(intentional any): not "any" will break it all
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class FrameBufferCommand extends command_1.default {
    execute(format) {
        this._send('framebuffer:');
        return this.parser.readAscii(4).then((reply) => {
            switch (reply) {
                case protocol_1.default.OKAY:
                    return this.parser.readBytes(52).then((header) => {
                        let stream;
                        const meta = this._parseHeader(header);
                        switch (format) {
                            case 'raw':
                                stream = this.parser.raw();
                                stream.meta = meta;
                                return stream;
                            default:
                                stream = this._convert(meta, format);
                                stream.meta = meta;
                                return stream;
                        }
                    });
                case protocol_1.default.FAIL:
                    return this.parser.readError();
                default:
                    return this.parser.unexpected(reply, 'OKAY or FAIL');
            }
        });
    }
    _convert(meta, format, raw) {
        debug(`Converting raw framebuffer stream into ${format.toUpperCase()}`);
        switch (meta.format) {
            case 'rgb':
            case 'rgba':
                break;
            default:
                // Known to be supported by GraphicsMagick
                debug(`Silently transforming '${meta.format}' into 'rgb' for \`gm\``);
                const transform = new rgbtransform_1.default(meta);
                meta.format = 'rgb';
                raw = this.parser.raw().pipe(transform);
        }
        const proc = (0, child_process_1.spawn)('gm', ['convert', '-size', `${meta.width}x${meta.height}`, `${meta.format}:-`, `${format}:-`]);
        if (raw) {
            raw.pipe(proc.stdin);
        }
        return proc.stdout;
    }
    _parseHeader(header) {
        let offset = 0;
        const version = header.readUInt32LE(offset);
        if (version === 16) {
            throw new Error('Old-style raw images are not supported');
        }
        offset += 4;
        const bpp = header.readUInt32LE(offset);
        offset += 4;
        const size = header.readUInt32LE(offset);
        offset += 4;
        const width = header.readUInt32LE(offset);
        offset += 4;
        const height = header.readUInt32LE(offset);
        offset += 4;
        const red_offset = header.readUInt32LE(offset);
        offset += 4;
        const red_length = header.readUInt32LE(offset);
        offset += 4;
        const blue_offset = header.readUInt32LE(offset);
        offset += 4;
        const blue_length = header.readUInt32LE(offset);
        offset += 4;
        const green_offset = header.readUInt32LE(offset);
        offset += 4;
        const green_length = header.readUInt32LE(offset);
        offset += 4;
        const alpha_offset = header.readUInt32LE(offset);
        offset += 4;
        const alpha_length = header.readUInt32LE(offset);
        let format = blue_offset === 0 ? 'bgr' : 'rgb';
        if (bpp === 32 || alpha_length) {
            format += 'a';
        }
        return {
            version,
            bpp,
            size,
            width,
            height,
            red_offset,
            red_length,
            blue_offset,
            blue_length,
            green_offset,
            green_length,
            alpha_offset,
            alpha_length,
            format: format,
        };
    }
}
exports.default = FrameBufferCommand;
//# sourceMappingURL=framebuffer.js.map