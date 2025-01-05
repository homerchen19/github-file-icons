/// <reference types="node" />
import Command from '../../command';
import { Duplex } from 'stream';
import Bluebird from 'bluebird';
export default class LogCommand extends Command<Duplex> {
    execute(name: string): Bluebird<Duplex>;
}
//# sourceMappingURL=log.d.ts.map