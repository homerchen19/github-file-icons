/// <reference types="node" />
/// <reference types="rimraf" />
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { ChildProcess } from 'child_process';
export interface Options {
    startingUrl?: string;
    chromeFlags?: Array<string>;
    port?: number;
    handleSIGINT?: boolean;
    chromePath?: string;
    userDataDir?: string | boolean;
    logLevel?: 'verbose' | 'info' | 'error' | 'silent';
    ignoreDefaultFlags?: boolean;
    connectionPollInterval?: number;
    maxConnectionRetries?: number;
    envVars?: {
        [key: string]: string | undefined;
    };
}
export interface LaunchedChrome {
    pid: number;
    port: number;
    process: ChildProcess;
    kill: () => Promise<{}>;
}
export interface ModuleOverrides {
    fs?: typeof fs;
    rimraf?: typeof rimraf;
    spawn?: typeof childProcess.spawn;
}
declare function launch(opts?: Options): Promise<LaunchedChrome>;
declare class Launcher {
    private opts;
    private tmpDirandPidFileReady;
    private pidFile;
    private startingUrl;
    private outFile?;
    private errFile?;
    private chromePath?;
    private ignoreDefaultFlags?;
    private chromeFlags;
    private requestedPort?;
    private connectionPollInterval;
    private maxConnectionRetries;
    private fs;
    private rimraf;
    private spawn;
    private useDefaultProfile;
    private envVars;
    chrome?: childProcess.ChildProcess;
    userDataDir?: string;
    port?: number;
    pid?: number;
    constructor(opts?: Options, moduleOverrides?: ModuleOverrides);
    private readonly flags;
    defaultFlags(): string[];
    makeTmpDir(): string;
    prepare(): void;
    launch(): Promise<void | {}>;
    private spawnProcess(execPath);
    private cleanup(client?);
    private isDebuggerReady();
    private waitUntilReady();
    kill(): Promise<{}>;
    destroyTmp(): Promise<{}>;
}
export default Launcher;
export { Launcher, launch };
