import LineTransform from '../../linetransform';
import Command from '../../command';
import Bluebird from 'bluebird';
export default class LogcatCommand extends Command<any> {
    execute(options?: {
        clear?: boolean;
    }): Bluebird<LineTransform>;
}
//# sourceMappingURL=logcat.d.ts.map