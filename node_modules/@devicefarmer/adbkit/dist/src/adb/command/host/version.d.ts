import Command from '../../command';
import Bluebird from 'bluebird';
export default class HostVersionCommand extends Command<number> {
    execute(): Bluebird<number>;
    _parseVersion(version: string): number;
}
//# sourceMappingURL=version.d.ts.map