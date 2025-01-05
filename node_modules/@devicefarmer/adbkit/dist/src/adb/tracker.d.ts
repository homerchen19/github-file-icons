/// <reference types="node" />
import Bluebird from 'bluebird';
import { EventEmitter } from 'events';
import Device from '../Device';
import HostDevicesCommand from './command/host/devices';
import HostDevicesWithPathsCommand from './command/host/deviceswithpaths';
export default class Tracker extends EventEmitter {
    private readonly command;
    private deviceList;
    private deviceMap;
    private reader;
    constructor(command: HostDevicesCommand | HostDevicesWithPathsCommand);
    read(): Bluebird<Device[]>;
    update(newList: Device[]): Tracker;
    end(): Tracker;
}
//# sourceMappingURL=tracker.d.ts.map