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
const fs_1 = __importDefault(require("fs"));
const commander_1 = require("commander");
const node_forge_1 = __importDefault(require("node-forge"));
const pkg = __importStar(require("../package.json"));
const adb_1 = __importDefault(require("./adb"));
const auth_1 = __importDefault(require("./adb/auth"));
const packetreader_1 = __importDefault(require("./adb/tcpusb/packetreader"));
const bluebird_1 = __importDefault(require("bluebird"));
const program = new commander_1.Command();
program.version(pkg.version);
program
    .command('pubkey-convert <file>')
    .option('-f, --format <format>', 'format (pem or openssh)', String, 'pem')
    .description('Converts an ADB-generated public key into PEM format.')
    .action(function (file, options) {
    return auth_1.default.parsePublicKey(fs_1.default.readFileSync(file).toString('utf8')).then((key) => {
        switch (options.format.toLowerCase()) {
            case 'pem':
                return console.log(node_forge_1.default.pki.publicKeyToPem(key).trim());
            case 'openssh':
                return console.log(node_forge_1.default.ssh.publicKeyToOpenSSH(key, 'adbkey').trim());
            default:
                console.error("Unsupported format '" + options.format + "'");
                return process.exit(1);
        }
    });
});
program
    .command('pubkey-fingerprint <file>')
    .description('Outputs the fingerprint of an ADB-generated public key.')
    .action(function (file) {
    return auth_1.default.parsePublicKey(fs_1.default.readFileSync(file).toString('utf8')).then((key) => {
        return console.log('%s %s', key.fingerprint, key.comment);
    });
});
program
    .command('usb-device-to-tcp <serial>')
    .option('-p, --port <port>', 'port number', (value) => String(value), '6174')
    .description('Provides an USB device over TCP using a translating proxy.')
    .action((serial, options) => {
    const adb = adb_1.default.createClient();
    const server = adb
        .createTcpUsbBridge(serial, {
        auth: () => bluebird_1.default.resolve(),
    })
        .on('listening', () => console.info('Connect with `adb connect localhost:%d`', options.port))
        .on('error', (err) => console.error('An error occured: ' + err.message));
    server.listen(options.port);
});
program
    .command('parse-tcp-packets <file>')
    .description('Parses ADB TCP packets from the given file.')
    .action((file) => {
    const reader = new packetreader_1.default(fs_1.default.createReadStream(file));
    reader.on('packet', (packet) => console.log(packet.toString()));
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map