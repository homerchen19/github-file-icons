import parse from 'parse-author';
import { Options, PackageJson } from './types';
export default function sortContributors<TKey extends 'author' | 'contributors' | 'maintainers'>(key: TKey, packageJson: PackageJson, opts?: Options): {
    [x: string]: string | parse.Author;
} | {
    [x: string]: string[] | parse.Author[];
};
