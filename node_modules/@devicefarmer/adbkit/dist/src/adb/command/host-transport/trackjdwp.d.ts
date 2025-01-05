import Bluebird from 'bluebird';
import Command from '../../command';
import JdwpTracker from '../../jdwptracker';
export default class TrackJdwpCommand extends Command<JdwpTracker> {
    execute(): Bluebird<JdwpTracker>;
}
//# sourceMappingURL=trackjdwp.d.ts.map