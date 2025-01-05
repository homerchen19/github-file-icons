"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = require("events");
const parser_1 = __importDefault(require("../parser"));
const bluebird_1 = __importDefault(require("bluebird"));
const RE_CPULINE = /^cpu[0-9]+ .*$/gm;
const RE_COLSEP = /\ +/g;
class ProcStat extends events_1.EventEmitter {
    constructor(sync) {
        super();
        this.sync = sync;
        this.interval = 1000;
        this.stats = this._emptyStats();
        this._ignore = {};
        this._timer = setInterval(() => {
            return this.update();
        }, this.interval);
        this.update();
    }
    end() {
        clearInterval(this._timer);
        if (this.sync) {
            this.sync.end();
            this.sync = undefined;
        }
    }
    update() {
        if (!this.sync) {
            throw Error('Closed');
        }
        return new parser_1.default(this.sync.pull('/proc/stat'))
            .readAll()
            .then((out) => {
            return this._parse(out.toString());
        })
            .catch((err) => {
            this._error(err);
            return bluebird_1.default.reject(err);
        });
    }
    _parse(out) {
        let match, val;
        const stats = this._emptyStats();
        while ((match = RE_CPULINE.exec(out))) {
            const line = match[0];
            const cols = line.split(RE_COLSEP);
            const type = cols.shift();
            if (this._ignore[type] === line) {
                continue;
            }
            let total = 0;
            for (let i = 0, len = cols.length; i < len; i++) {
                val = cols[i];
                total += +val;
            }
            stats.cpus[type] = {
                line: line,
                user: +cols[0] || 0,
                nice: +cols[1] || 0,
                system: +cols[2] || 0,
                idle: +cols[3] || 0,
                iowait: +cols[4] || 0,
                irq: +cols[5] || 0,
                softirq: +cols[6] || 0,
                steal: +cols[7] || 0,
                guest: +cols[8] || 0,
                guestnice: +cols[9] || 0,
                total: total,
            };
        }
        return this._set(stats);
    }
    _set(stats) {
        const loads = {};
        let found = false;
        const ref = stats.cpus;
        for (const id in ref) {
            const cur = ref[id];
            const old = this.stats.cpus[id];
            if (!old) {
                continue;
            }
            const ticks = cur.total - old.total;
            if (ticks > 0) {
                found = true;
                // Calculate percentages for everything. For ease of formatting,
                // let's do `x / y * 100` as `100 / y * x`.
                const m = 100 / ticks;
                loads[id] = {
                    user: Math.floor(m * (cur.user - old.user)),
                    nice: Math.floor(m * (cur.nice - old.nice)),
                    system: Math.floor(m * (cur.system - old.system)),
                    idle: Math.floor(m * (cur.idle - old.idle)),
                    iowait: Math.floor(m * (cur.iowait - old.iowait)),
                    irq: Math.floor(m * (cur.irq - old.irq)),
                    softirq: Math.floor(m * (cur.softirq - old.softirq)),
                    steal: Math.floor(m * (cur.steal - old.steal)),
                    guest: Math.floor(m * (cur.guest - old.guest)),
                    guestnice: Math.floor(m * (cur.guestnice - old.guestnice)),
                    total: 100,
                };
            }
            else {
                // The CPU is either offline (nothing was done) or it mysteriously
                // warped back in time (idle stat dropped significantly), causing the
                // total tick count to be <0. The latter seems to only happen on
                // Galaxy S4 so far. Either way we don't want those anomalies in our
                // stats. We'll also ignore the line in the next cycle. This doesn't
                // completely eliminate the anomalies, but it helps.
                this._ignore[id] = cur.line;
                delete stats.cpus[id];
            }
        }
        if (found) {
            this.emit('load', loads);
        }
        return (this.stats = stats);
    }
    _error(err) {
        return this.emit('error', err);
    }
    _emptyStats() {
        return {
            cpus: {},
        };
    }
}
module.exports = ProcStat;
//# sourceMappingURL=stat.js.map