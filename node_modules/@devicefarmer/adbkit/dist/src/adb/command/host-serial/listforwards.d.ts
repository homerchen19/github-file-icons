import Command from '../../command';
import Forward from '../../../Forward';
import Bluebird from 'bluebird';
export default class ListForwardsCommand extends Command<Forward[]> {
    execute(serial: string): Bluebird<Forward[]>;
    private _parseForwards;
}
//# sourceMappingURL=listforwards.d.ts.map