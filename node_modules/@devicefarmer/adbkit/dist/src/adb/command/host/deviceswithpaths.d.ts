import Command from '../../command';
import DeviceWithPath from '../../../DeviceWithPath';
import Bluebird from 'bluebird';
export default class HostDevicesWithPathsCommand extends Command<DeviceWithPath[]> {
    execute(): Bluebird<DeviceWithPath[]>;
    _readDevices(): Bluebird<DeviceWithPath[]>;
    private _parseDevices;
}
//# sourceMappingURL=deviceswithpaths.d.ts.map