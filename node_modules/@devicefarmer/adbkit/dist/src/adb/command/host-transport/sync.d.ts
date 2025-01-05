import Sync from '../../sync';
import Command from '../../command';
import Bluebird from 'bluebird';
export default class SyncCommand extends Command<Sync> {
    execute(): Bluebird<Sync>;
}
//# sourceMappingURL=sync.d.ts.map