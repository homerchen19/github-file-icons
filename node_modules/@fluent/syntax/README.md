# @fluent/syntax ![](https://github.com/projectfluent/fluent.js/workflows/test/badge.svg)

`@fluent/syntax` is a tooling library for parsing, serializing, and working
with the Fluent syntax. It's part of [Project Fluent][].

[project fluent]: https://projectfluent.org

## Installation

`@fluent/syntax` can be used both on the client-side and the server-side. You
can install it from the npm registry or use it as a standalone script (as the
`FluentSyntax` global).

    npm install @fluent/syntax

## How to use

```javascript
import { parse, Resource } from "@fluent/syntax";

const res = parse(`
-brand-name = Foo 3000
welcome = Welcome, {$name}, to {-brand-name}!
`);

assert(res instanceof Resource);
```

The API reference is available at https://projectfluent.org/fluent.js/syntax.
