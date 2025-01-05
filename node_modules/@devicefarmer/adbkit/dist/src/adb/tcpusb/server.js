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
const socket_1 = __importDefault(require("./socket"));
const events_1 = require("events");
class Server extends events_1.EventEmitter {
    constructor(client, serial, options) {
        super();
        this.client = client;
        this.serial = serial;
        this.options = options;
        this.connections = [];
        this.server = Net.createServer({
            allowHalfOpen: true,
        });
        this.server.on('error', (err) => this.emit('error', err));
        this.server.on('listening', () => this.emit('listening'));
        this.server.on('close', () => this.emit('close'));
        this.server.on('connection', (conn) => {
            const socket = new socket_1.default(this.client, this.serial, conn, this.options);
            this.connections.push(socket);
            socket.on('error', (err) => {
                // 'conn' is guaranteed to get ended
                return this.emit('error', err);
            });
            socket.once('end', () => {
                // 'conn' is guaranteed to get ended
                return (this.connections = this.connections.filter(function (val) {
                    return val !== socket;
                }));
            });
            return this.emit('connection', socket);
        });
    }
    listen(...args) {
        this.server.listen(...args);
        return this;
    }
    close() {
        this.server.close();
        return this;
    }
    end() {
        const ref = this.connections;
        for (let i = 0, len = ref.length; i < len; i++) {
            ref[i].end();
        }
        return this;
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map