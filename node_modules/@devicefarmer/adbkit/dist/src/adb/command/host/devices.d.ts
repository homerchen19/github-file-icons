/// <reference types="node" />
import Command from '../../command';
import Device from '../../../Device';
import Bluebird from 'bluebird';
export default class HostDevicesCommand extends Command<Device[]> {
    execute(): Bluebird<Device[]>;
    _readDevices(): Bluebird<Device[]>;
    _parseDevices(value: Buffer): Device[];
}
//# sourceMappingURL=devices.d.ts.map