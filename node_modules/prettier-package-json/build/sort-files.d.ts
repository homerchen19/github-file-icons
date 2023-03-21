/**
 * Sort and filter files field
 *
 * More info:
 *   https://docs.npmjs.com/files/package.json#files
 */
import { PackageJson } from './types';
export default function sortFiles(packageJson: PackageJson): {
    files?: PackageJson['files'];
};
