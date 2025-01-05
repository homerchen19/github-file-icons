import Command from '../../command';
import Bluebird from 'bluebird';
export default class IsInstalledCommand extends Command<boolean> {
    execute(pkg: string): Bluebird<boolean>;
}
//# sourceMappingURL=isinstalled.d.ts.map