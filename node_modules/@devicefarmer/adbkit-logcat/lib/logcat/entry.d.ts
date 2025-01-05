/// <reference types="node" />
declare class Entry {
    date: Date;
    pid: number;
    tid: number;
    priority: number;
    tag: string;
    message: string;
    setDate(date: Date): void;
    setPid(pid: number): void;
    setTid(tid: number): void;
    setPriority(priority: number): void;
    setTag(tag: string): void;
    setMessage(message: string): void;
    toBinary(): Buffer;
}
export = Entry;
