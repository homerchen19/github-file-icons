import StartActivityCommand from './startactivity';
import StartServiceOptions from '../../../StartServiceOptions';
import Bluebird from 'bluebird';
export default class StartServiceCommand extends StartActivityCommand {
    execute(options: StartServiceOptions): Bluebird<boolean>;
}
//# sourceMappingURL=startservice.d.ts.map