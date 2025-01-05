import Command from '../../command';
import Bluebird from 'bluebird';
export default class WaitForDeviceCommand extends Command<string> {
    execute(serial: string): Bluebird<string>;
}
//# sourceMappingURL=waitfordevice.d.ts.map