import Command from '../../command';
import Bluebird from 'bluebird';
export default class GetDevicePathCommand extends Command<string> {
    execute(serial: string): Bluebird<string>;
}
//# sourceMappingURL=getdevicepath.d.ts.map