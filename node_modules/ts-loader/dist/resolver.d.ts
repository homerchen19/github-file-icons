import type * as webpack from 'webpack';
export declare function makeResolver(options: webpack.WebpackOptionsNormalized): ResolveSync;
export declare type ResolveSync = (context: string | undefined, path: string, moduleName: string) => string | false;
//# sourceMappingURL=resolver.d.ts.map