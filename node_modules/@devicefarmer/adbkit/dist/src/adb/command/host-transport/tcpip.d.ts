import Command from '../../command';
import Bluebird from 'bluebird';
export default class TcpIpCommand extends Command<number> {
    execute(port: number): Bluebird<number>;
}
//# sourceMappingURL=tcpip.d.ts.map