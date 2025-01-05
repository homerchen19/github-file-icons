import Command from '../../command';
import Bluebird from 'bluebird';
export default class HostDisconnectCommand extends Command<string> {
    execute(host: string, port: number): Bluebird<string>;
}
//# sourceMappingURL=disconnect.d.ts.map