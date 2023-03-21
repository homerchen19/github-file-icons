import type { Options, PackageJson } from './types';
export { Options };
export declare function format(packageJson: PackageJson, opts?: Options): string;
export declare function check(packageJson: string | PackageJson, opts: Options): boolean;
