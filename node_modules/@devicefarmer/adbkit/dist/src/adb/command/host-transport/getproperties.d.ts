import Command from '../../command';
import Bluebird from 'bluebird';
import { Properties } from '../../../Properties';
export default class GetPropertiesCommand extends Command<any> {
    execute(): Bluebird<Properties>;
    private _parseProperties;
}
//# sourceMappingURL=getproperties.d.ts.map