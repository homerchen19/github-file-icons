/// <reference types="node" />
import Bluebird from 'bluebird';
import Command from '../../command';
import { Duplex } from 'stream';
export default class MonkeyCommand extends Command<Duplex> {
    execute(port: number): Bluebird<Duplex>;
}
//# sourceMappingURL=monkey.d.ts.map