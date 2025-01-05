import {IOptions} from 'minimatch';

export type Options = Readonly<IOptions>;

/**
Extends [`minimatch.match()`](https://github.com/isaacs/minimatch#minimatchmatchlist-pattern-options) with support for multiple patterns.

@param paths - The paths to match against.
@param patterns - Globbing patterns to use. For example: `['*', '!cake']`. See supported [`minimatch` patterns](https://github.com/isaacs/minimatch#usage).
@returns The matching paths in the order of input paths.

@example
```
import multimatch from 'multimatch';

multimatch(['unicorn', 'cake', 'rainbows'], ['*', '!cake']);
//=> ['unicorn', 'rainbows']
```
*/
export default function multimatch(
	paths: string | readonly string[],
	patterns: string | readonly string[],
	options?: Options
): string[];

