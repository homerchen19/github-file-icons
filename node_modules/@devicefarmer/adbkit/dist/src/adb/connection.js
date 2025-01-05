"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Net = __importStar(require("net"));
const events_1 = require("events");
const child_process_1 = require("child_process");
const parser_1 = __importDefault(require("./parser"));
const dump_1 = __importDefault(require("./dump"));
const debug_1 = __importDefault(require("debug"));
const bluebird_1 = __importDefault(require("bluebird"));
const debug = (0, debug_1.default)('adb:connection');
class Connection extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = options || { port: 0 };
        // this.socket = null;
        // this.parser = null;
        this.triedStarting = false;
    }
    connect() {
        this.socket = Net.connect(this.options);
        this.socket.setNoDelay(true);
        this.parser = new parser_1.default(this.socket);
        this.socket.on('connect', () => this.emit('connect'));
        this.socket.on('end', () => this.emit('end'));
        this.socket.on('drain', () => this.emit('drain'));
        this.socket.on('timeout', () => this.emit('timeout'));
        this.socket.on('close', (hadError) => this.emit('close', hadError));
        return new bluebird_1.default((resolve, reject) => {
            this.socket.once('connect', resolve);
            this.socket.once('error', reject);
        })
            .catch((err) => {
            if (err.code === 'ECONNREFUSED' && !this.triedStarting) {
                debug("Connection was refused, let's try starting the server once");
                this.triedStarting = true;
                return this.startServer().then(() => {
                    return this.connect();
                });
            }
            else {
                this.end();
                throw err;
            }
        })
            .then(() => {
            // Emit unhandled error events, so that they can be handled on the client.
            // Without this, they would just crash node unavoidably.
            if (this.socket) {
                this.socket.on('error', (err) => {
                    if (this.socket && this.socket.listenerCount('error') === 1) {
                        this.emit('error', err);
                    }
                });
            }
            return this;
        });
    }
    /**
     * added for Mock testing
     */
    getSocket() {
        return this.socket;
    }
    end() {
        if (this.socket) {
            this.socket.end();
        }
        return this;
    }
    write(data, callback) {
        this.socket.write((0, dump_1.default)(data), callback);
        return this;
    }
    startServer() {
        let port = 0;
        if ('port' in this.options) {
            port = this.options.port;
        }
        const args = port ? ['-P', String(port), 'start-server'] : ['start-server'];
        debug(`Starting ADB server via '${this.options.bin} ${args.join(' ')}'`);
        return this._exec(args, {});
    }
    _exec(args, options) {
        debug(`CLI: ${this.options.bin} ${args.join(' ')}`);
        return bluebird_1.default.promisify(child_process_1.execFile)(this.options.bin, args, options);
    }
}
exports.default = Connection;
//# sourceMappingURL=connection.js.map