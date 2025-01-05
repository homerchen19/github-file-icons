import Command from '../../command';
import Bluebird from 'bluebird';
export default class GetStateCommand extends Command<string> {
    execute(serial: string): Bluebird<string>;
}
//# sourceMappingURL=getstate.d.ts.map