/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWSLLocalAppDataPath = exports.toWSLPath = exports.toWin32Path = exports.makeTmpDir = exports.getPlatform = exports.ChromeNotInstalledError = exports.UnsupportedPlatformError = exports.InvalidUserDataDirectoryError = exports.ChromePathNotSetError = exports.LauncherError = exports.delay = exports.defaults = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const isWsl = require("is-wsl");
function defaults(val, def) {
    return typeof val === 'undefined' ? def : val;
}
exports.defaults = defaults;
async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
exports.delay = delay;
class LauncherError extends Error {
    constructor(message = 'Unexpected error', code) {
        super();
        this.message = message;
        this.code = code;
        this.stack = new Error().stack;
        return this;
    }
}
exports.LauncherError = LauncherError;
class ChromePathNotSetError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'The CHROME_PATH environment variable must be set to a Chrome/Chromium executable no older than Chrome stable.';
        this.code = "ERR_LAUNCHER_PATH_NOT_SET" /* ERR_LAUNCHER_PATH_NOT_SET */;
    }
}
exports.ChromePathNotSetError = ChromePathNotSetError;
class InvalidUserDataDirectoryError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'userDataDir must be false or a path.';
        this.code = "ERR_LAUNCHER_INVALID_USER_DATA_DIRECTORY" /* ERR_LAUNCHER_INVALID_USER_DATA_DIRECTORY */;
    }
}
exports.InvalidUserDataDirectoryError = InvalidUserDataDirectoryError;
class UnsupportedPlatformError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = `Platform ${getPlatform()} is not supported.`;
        this.code = "ERR_LAUNCHER_UNSUPPORTED_PLATFORM" /* ERR_LAUNCHER_UNSUPPORTED_PLATFORM */;
    }
}
exports.UnsupportedPlatformError = UnsupportedPlatformError;
class ChromeNotInstalledError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'No Chrome installations found.';
        this.code = "ERR_LAUNCHER_NOT_INSTALLED" /* ERR_LAUNCHER_NOT_INSTALLED */;
    }
}
exports.ChromeNotInstalledError = ChromeNotInstalledError;
function getPlatform() {
    return isWsl ? 'wsl' : process.platform;
}
exports.getPlatform = getPlatform;
function makeTmpDir() {
    switch (getPlatform()) {
        case 'darwin':
        case 'linux':
            return makeUnixTmpDir();
        case 'wsl':
            // We populate the user's Windows temp dir so the folder is correctly created later
            process.env.TEMP = getWSLLocalAppDataPath(`${process.env.PATH}`);
        case 'win32':
            return makeWin32TmpDir();
        default:
            throw new UnsupportedPlatformError();
    }
}
exports.makeTmpDir = makeTmpDir;
function toWinDirFormat(dir = '') {
    const results = /\/mnt\/([a-z])\//.exec(dir);
    if (!results) {
        return dir;
    }
    const driveLetter = results[1];
    return dir.replace(`/mnt/${driveLetter}/`, `${driveLetter.toUpperCase()}:\\`)
        .replace(/\//g, '\\');
}
function toWin32Path(dir = '') {
    if (/[a-z]:\\/iu.test(dir)) {
        return dir;
    }
    try {
        return child_process_1.execFileSync('wslpath', ['-w', dir]).toString().trim();
    }
    catch {
        return toWinDirFormat(dir);
    }
}
exports.toWin32Path = toWin32Path;
function toWSLPath(dir, fallback) {
    try {
        return child_process_1.execFileSync('wslpath', ['-u', dir]).toString().trim();
    }
    catch {
        return fallback;
    }
}
exports.toWSLPath = toWSLPath;
function getLocalAppDataPath(path) {
    const userRegExp = /\/mnt\/([a-z])\/Users\/([^\/:]+)\/AppData\//;
    const results = userRegExp.exec(path) || [];
    return `/mnt/${results[1]}/Users/${results[2]}/AppData/Local`;
}
function getWSLLocalAppDataPath(path) {
    const userRegExp = /\/([a-z])\/Users\/([^\/:]+)\/AppData\//;
    const results = userRegExp.exec(path) || [];
    return toWSLPath(`${results[1]}:\\Users\\${results[2]}\\AppData\\Local`, getLocalAppDataPath(path));
}
exports.getWSLLocalAppDataPath = getWSLLocalAppDataPath;
function makeUnixTmpDir() {
    return child_process_1.execSync('mktemp -d -t lighthouse.XXXXXXX').toString().trim();
}
function makeWin32TmpDir() {
    const winTmpPath = process.env.TEMP || process.env.TMP ||
        (process.env.SystemRoot || process.env.windir) + '\\temp';
    const randomNumber = Math.floor(Math.random() * 9e7 + 1e7);
    const tmpdir = path_1.join(winTmpPath, 'lighthouse.' + randomNumber);
    fs_1.mkdirSync(tmpdir, { recursive: true });
    return tmpdir;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILFlBQVksQ0FBQzs7O0FBRWIsK0JBQTBCO0FBQzFCLGlEQUFxRDtBQUNyRCwyQkFBNkI7QUFDN0IsZ0NBQWlDO0FBU2pDLFNBQWdCLFFBQVEsQ0FBSSxHQUFnQixFQUFFLEdBQU07SUFDbEQsT0FBTyxPQUFPLEdBQUcsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0QkFFQztBQUVNLEtBQUssVUFBVSxLQUFLLENBQUMsSUFBWTtJQUN0QyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFGRCxzQkFFQztBQUVELE1BQWEsYUFBYyxTQUFRLEtBQUs7SUFDdEMsWUFBbUIsVUFBa0Isa0JBQWtCLEVBQVMsSUFBYTtRQUMzRSxLQUFLLEVBQUUsQ0FBQztRQURTLFlBQU8sR0FBUCxPQUFPLENBQTZCO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUztRQUUzRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBTkQsc0NBTUM7QUFFRCxNQUFhLHFCQUFzQixTQUFRLGFBQWE7SUFBeEQ7O1FBQ0UsWUFBTyxHQUNILCtHQUErRyxDQUFDO1FBQ3BILFNBQUksK0RBQThDO0lBQ3BELENBQUM7Q0FBQTtBQUpELHNEQUlDO0FBRUQsTUFBYSw2QkFBOEIsU0FBUSxhQUFhO0lBQWhFOztRQUNFLFlBQU8sR0FBRyxzQ0FBc0MsQ0FBQztRQUNqRCxTQUFJLDZGQUE2RDtJQUNuRSxDQUFDO0NBQUE7QUFIRCxzRUFH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