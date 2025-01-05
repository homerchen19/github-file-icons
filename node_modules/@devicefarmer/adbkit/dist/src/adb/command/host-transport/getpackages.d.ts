import Command from '../../command';
import Bluebird from 'bluebird';
export default class GetPackagesCommand extends Command<string[]> {
    execute(flags?: string): Bluebird<string[]>;
    private _parsePackages;
}
//# sourceMappingURL=getpackages.d.ts.map