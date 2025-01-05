import Command from '../../command';
import Reverse from '../../../Reverse';
import Bluebird from 'bluebird';
export default class ListReversesCommand extends Command<Reverse[]> {
    execute(): Bluebird<Reverse[]>;
    private _parseReverses;
}
//# sourceMappingURL=listreverses.d.ts.map