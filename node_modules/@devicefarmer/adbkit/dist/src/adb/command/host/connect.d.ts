import Command from '../../command';
import Bluebird from 'bluebird';
export default class HostConnectCommand extends Command<string> {
    execute(host: string, port: number): Bluebird<string>;
}
//# sourceMappingURL=connect.d.ts.map