import Command from '../../command';
import Bluebird from 'bluebird';
export default class ReverseCommand extends Command<boolean> {
    execute(remote: string, local: string): Bluebird<boolean>;
}
//# sourceMappingURL=reverse.d.ts.map