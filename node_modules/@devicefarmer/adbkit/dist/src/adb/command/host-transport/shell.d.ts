/// <reference types="node" />
import Command from '../../command';
import { Duplex } from 'stream';
import Bluebird from 'bluebird';
import WithToString from '../../../WithToString';
export default class ShellCommand extends Command<Duplex> {
    execute(command: string | ArrayLike<WithToString>): Bluebird<Duplex>;
}
//# sourceMappingURL=shell.d.ts.map