import Command from '../../command';
import Bluebird from 'bluebird';
export default class InstallCommand extends Command<boolean> {
    execute(apk: string): Bluebird<boolean>;
}
//# sourceMappingURL=install.d.ts.map