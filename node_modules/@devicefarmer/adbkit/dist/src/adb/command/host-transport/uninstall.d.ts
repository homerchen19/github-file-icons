import Command from '../../command';
import Bluebird from 'bluebird';
export default class UninstallCommand extends Command<boolean> {
    execute(pkg: string): Bluebird<boolean>;
}
//# sourceMappingURL=uninstall.d.ts.map