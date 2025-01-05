import Command from '../../command';
import Bluebird from 'bluebird';
export default class ClearCommand extends Command<boolean> {
    execute(pkg: string): Bluebird<boolean>;
}
//# sourceMappingURL=clear.d.ts.map