import Command from '../../command';
import Bluebird from 'bluebird';
import { Features } from '../../../Features';
export default class GetFeaturesCommand extends Command<Features> {
    execute(): Bluebird<Features>;
    private _parseFeatures;
}
//# sourceMappingURL=getfeatures.d.ts.map