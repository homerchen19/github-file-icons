import Command from '../../command';
import Bluebird from 'bluebird';
export default class GetSerialNoCommand extends Command<string> {
    execute(serial: string): Bluebird<string>;
}
//# sourceMappingURL=getserialno.d.ts.map