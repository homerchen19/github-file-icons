/// <reference types="node" />
import { EventEmitter } from 'events';
import Bluebird from 'bluebird';
import Command from './command';
interface JdwpTrackerChangeSet {
    /**
     * array of pid
     */
    removed: string[];
    /**
     * array of pid
     */
    added: string[];
}
export default class JdwpTracker extends EventEmitter {
    private command;
    private pids;
    private pidMap;
    private reader;
    constructor(command: Command<JdwpTracker>);
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'remove', listener: (pid: string) => void): this;
    on(event: 'add', listener: (pid: string) => void): this;
    on(event: 'changeSet', listener: (changeSet: JdwpTrackerChangeSet, newList: string[]) => void): this;
    once(event: 'end', listener: () => void): this;
    once(event: 'error', listener: (err: Error) => void): this;
    once(event: 'remove', listener: (pid: string) => void): this;
    once(event: 'add', listener: (pid: string) => void): this;
    once(event: 'changeSet', listener: (changeSet: JdwpTrackerChangeSet, newList: string[]) => void): this;
    emit(event: 'end'): boolean;
    emit(event: 'error', err: Error): boolean;
    emit(event: 'remove', pid: string): boolean;
    emit(event: 'add', pid: string): boolean;
    emit(event: 'changeSet', changeSet: JdwpTrackerChangeSet, newList: string[]): boolean;
    read(): Bluebird<JdwpTracker>;
    update(newList: string[]): JdwpTracker;
    end(): JdwpTracker;
}
export {};
//# sourceMappingURL=jdwptracker.d.ts.map