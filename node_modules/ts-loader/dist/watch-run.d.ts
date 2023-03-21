import * as webpack from 'webpack';
import { LoaderOptions, TSInstance } from './interfaces';
/**
 * Make function which will manually update changed files
 */
export declare function makeWatchRun(instance: TSInstance, loader: webpack.LoaderContext<LoaderOptions>): (compiler: webpack.Compiler, callback: (err?: Error | undefined) => void) => void;
//# sourceMappingURL=watch-run.d.ts.map