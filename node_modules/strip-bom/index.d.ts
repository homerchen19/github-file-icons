/**
Strip UTF-8 [byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark#UTF-8) (BOM) from a string.

@example
```
import stripBom from 'strip-bom';

stripBom('\uFEFFunicorn');
//=> 'unicorn'
```
*/
export default function stripBom(string: string): string;
