"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const events_1 = require("events");
const bluebird_1 = __importDefault(require("bluebird"));
const parser_1 = __importDefault(require("./parser"));
class JdwpTracker extends events_1.EventEmitter {
    constructor(command) {
        super();
        this.command = command;
        this.pids = [];
        this.pidMap = Object.create(null);
        this.command = command;
        this.pids = [];
        this.pidMap = Object.create(null);
        this.reader = this.read()
            .catch(parser_1.default.PrematureEOFError, () => {
            return this.emit('end');
        })
            .catch(bluebird_1.default.CancellationError, () => {
            this.command.connection.end();
            return this.emit('end');
        })
            .catch((err) => {
            this.command.connection.end();
            this.emit('error', err);
            return this.emit('end');
        });
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    read() {
        return this.command.parser.readValue().then((list) => {
            const pids = list.toString().split('\n');
            const maybeEmpty = pids.pop();
            if (maybeEmpty) {
                pids.push(maybeEmpty);
            }
            return this.update(pids);
        });
    }
    update(newList) {
        const changeSet = {
            removed: [],
            added: [],
        };
        const newMap = Object.create(null);
        for (let i = 0, len = newList.length; i < len; i++) {
            const pid = newList[i];
            if (!this.pidMap[pid]) {
                changeSet.added.push(pid);
                this.emit('add', pid);
                newMap[pid] = pid;
            }
        }
        const ref = this.pids;
        for (let j = 0, len1 = ref.length; j < len1; j++) {
            const pid = ref[j];
            if (!newMap[pid]) {
                changeSet.removed.push(pid);
                this.emit('remove', pid);
            }
        }
        this.pids = newList;
        this.pidMap = newMap;
        this.emit('changeSet', changeSet, newList);
        return this;
    }
    end() {
        this.reader.cancel();
        return this;
    }
}
exports.default = JdwpTracker;
//# sourceMappingURL=jdwptracker.js.map