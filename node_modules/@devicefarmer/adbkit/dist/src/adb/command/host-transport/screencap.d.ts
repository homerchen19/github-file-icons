/// <reference types="node" />
import Command from '../../command';
import Bluebird from 'bluebird';
import { Duplex } from 'stream';
export default class ScreencapCommand extends Command<Duplex> {
    execute(): Bluebird<Duplex>;
}
//# sourceMappingURL=screencap.d.ts.map