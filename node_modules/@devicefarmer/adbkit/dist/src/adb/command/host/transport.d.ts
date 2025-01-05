import Command from '../../command';
import Bluebird from 'bluebird';
export default class HostTransportCommand extends Command<boolean> {
    execute(serial: string): Bluebird<boolean>;
}
//# sourceMappingURL=transport.d.ts.map