/// <reference types="node" />
import Command from '../../command';
import { Duplex } from 'stream';
import Bluebird from 'bluebird';
export default class LocalCommand extends Command<Duplex> {
    execute(path: string): Bluebird<Duplex>;
}
//# sourceMappingURL=local.d.ts.map