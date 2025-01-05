import Command from '../../command';
import Bluebird from 'bluebird';
export default class ForwardCommand extends Command<boolean> {
    execute(serial: string, local: string, remote: string): Bluebird<boolean>;
}
//# sourceMappingURL=forward.d.ts.map