/// <reference types="node" />
import Command from '../../command';
import { Duplex } from 'stream';
import Bluebird from 'bluebird';
export default class TcpCommand extends Command<Duplex> {
    execute(port: number, host?: string): Bluebird<Duplex>;
}
//# sourceMappingURL=tcp.d.ts.map