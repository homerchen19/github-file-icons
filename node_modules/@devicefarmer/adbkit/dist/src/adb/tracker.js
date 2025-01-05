"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const parser_1 = __importDefault(require("./parser"));
const events_1 = require("events");
class Tracker extends events_1.EventEmitter {
    constructor(command) {
        super();
        this.command = command;
        this.deviceList = [];
        this.deviceMap = {};
        this.reader = this.read()
            .catch(bluebird_1.default.CancellationError, () => true)
            .catch(parser_1.default.PrematureEOFError, () => {
            throw new Error('Connection closed');
        })
            .catch((err) => this.emit('error', err))
            .finally(() => {
            this.command.parser.end().then(() => this.emit('end'));
        });
    }
    read() {
        return this.command._readDevices().then((list) => {
            this.update(list);
            return this.read();
        });
    }
    update(newList) {
        const changeSet = {
            removed: [],
            changed: [],
            added: [],
        };
        const newMap = {};
        for (let i = 0, len = newList.length; i < len; i++) {
            const device = newList[i];
            const oldDevice = this.deviceMap[device.id];
            if (oldDevice) {
                if (oldDevice.type !== device.type) {
                    changeSet.changed.push(device);
                    this.emit('change', device, oldDevice);
                }
            }
            else {
                changeSet.added.push(device);
                this.emit('add', device);
            }
            newMap[device.id] = device;
        }
        const ref = this.deviceList;
        for (let i = 0, len = ref.length; i < len; i++) {
            const device = ref[i];
            if (!newMap[device.id]) {
                changeSet.removed.push(device);
                this.emit('remove', device);
            }
        }
        this.emit('changeSet', changeSet);
        this.deviceList = newList;
        this.deviceMap = newMap;
        return this;
    }
    end() {
        this.reader.cancel();
        return this;
    }
}
exports.default = Tracker;
//# sourceMappingURL=tracker.js.map