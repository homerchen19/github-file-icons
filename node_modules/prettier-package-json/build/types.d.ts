import type { Author } from 'parse-author';
import type { PackageJson as PackageJsonTF } from 'type-fest';
export { Author };
export declare type PackageJson = PackageJsonTF & {
    $schema?: string;
};
export declare type PackageJsonKey = keyof PackageJson;
export declare type Options = Partial<{
    useTabs: boolean;
    tabWidth: number;
    expandUsers: boolean;
    enforceMultiple: boolean;
    keyOrder: PackageJsonKey[] | ((a: PackageJsonKey, b: PackageJsonKey) => -1 | 0 | 1);
}>;
