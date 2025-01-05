import { PackageJson } from './types';
export default function sortDependencies<TKey extends 'bundledDependencies' | 'bundleDependencies' | 'dependencies' | 'devDependencies' | 'optionalDependencies' | 'peerDependencies'>(key: TKey, packageJson: PackageJson): {
    [x: string]: PackageJson[TKey];
};
