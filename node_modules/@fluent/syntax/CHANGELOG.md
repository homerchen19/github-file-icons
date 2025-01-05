# Changelog

## [0.19.0](https://github.com/projectfluent/fluent.js/compare/@fluent/syntax@0.18.1...@fluent/syntax@0.19.0) (2023-03-13)

- Drop Node.js v12 support, add v18 & latest to CI tests
  ([#607](https://github.com/projectfluent/fluent.js/pull/607))
- Treat tab as text, not whitespace
  ([#606](https://github.com/projectfluent/fluent.js/pull/606))

## [0.18.1](https://github.com/projectfluent/fluent.js/compare/@fluent/syntax@0.18.0...@fluent/syntax@0.18.1) (2022-05-03)

### Bug Fixes

* Use correct TS type for `clone()` return ([#589](https://github.com/projectfluent/fluent.js/issues/589))
* Adjust for updated linter rules ([#590](https://github.com/projectfluent/fluent.js/pull/590))

## @fluent/syntax 0.18.0 (September 13, 2021)

- Remove `"type": "commonjs"` from the package's root `package.json`, but add
  `"type": "module"` to the `esm/` directory.
  ([#556](https://github.com/projectfluent/fluent.js/pull/556),
  [#567](https://github.com/projectfluent/fluent.js/pull/567))
- Set Node.js 12 as the minimum supported version
  ([#557](https://github.com/projectfluent/fluent.js/pull/557))

## @fluent/syntax 0.17.0 (April 9, 2021)

- Align AST types with fluent-rs. (#525)

  Use Union types instead of inheritance for `Entry`, `PatternElement`, `InlineExpression`, `Expression`, `Literal`, and `Comments`. The union types allow for type narrowing in TypeScript consumers.

- Use concrete argument types for `Visitor` and `Transformer`. (#525)

- Update TypeScript to 4.2 to support type imports and exports.

## @fluent/syntax 0.16.1 (September 15, 2020)

- Fix serialization of multiline patterns starting with special characters. (#512)

  The built-in behavior of `FluentSerializer` is to serialize multiline
  patterns starting on a new line:

  ```properties
  key =
      Foo
      Bar
  ```

  This used to lead to syntax errors if the pattern started with one of the
  special characters in the Fluent Syntax: a curly brace, a period, an
  asterisk, or a square bracket, and if it was originally written with the
  first line on the same line as the identifier:

  ```properties
  key = *Foo
      Bar
  ```

  Such a pattern must not be serialized as following, because the asterisk
  has a special meaning if placed at the beginning of a line.

  ```properties
  # Syntax Error
  key =
      *Foo
      Bar
  ```

  The fix preserves the original layout of the pattern, i.e. it is now
  serialized starting inline with the identifier.

## @fluent/syntax 0.16.0 (July 2, 2020)

- Remove the `compat.js` build and compile everything to ES2018. (#472)

  TypeScript source code is now compiled to ES2018 files in the `esm/`
  directory. These files are then bundled into a single `index.js` UMD file
  without any further transpilation.

  The `compat.js` build (available as `@fluent/syntax/compat`) was removed.
  Please use your own transpilation pipeline if ES2018 is too recent for
  your project.

  Refer to https://github.com/projectfluent/fluent.js/wiki/Compatibility
  for more information.

## @fluent/syntax 0.15.0 (March 2, 2020)

- Migrate `@fluent/syntax` to TypeScript. (#457)

  - `FluentSerializer` now relies on `instanceof` checks rather than
    `node.type` comparisons. Serializing a JSON dump of an AST is not
    supported any more.

## @fluent/syntax 0.14.0 (July 25, 2019)

- Rename `fluent-syntax` to `@fluent/syntax`.

## fluent-syntax 0.14.0 (July 25, 2019)

- Deprecate fluent-syntax. Plase use @fluent/syntax from now on.

## fluent-syntax 0.13.0 (April 17, 2019)

- Support Fluent Syntax 1.0.

  Fluent Syntax 1.0 has been published today. There are no changes to the
  grammar nor the AST compared to the Syntax 0.9.

## fluent-syntax 0.12.0 (March 26, 2019)

This release of `fluent-syntax` brings support for version 0.9 of the Fluent
Syntax spec. The API remains unchanged. Files written in valid Syntax 0.8 may
parse differently in this release. See the compatibility note below. Consult
the full Syntax 0.9 [changelog][chlog0.9] for details.

[chlog0.9]: https://github.com/projectfluent/fluent/releases/tag/v0.9.0

- Flatten complex reference expressions.

  Reference expressions which may take complex forms, such as a reference
  to a message's attribute, or a parameterized reference to an attribute of
  a term, are now stored in a simplified manner. Instead of nesting
  multiple expression nodes (e.g. `CallExpression` of an
  `AttributeExpression` of a `TermReference`), all information is available
  directly in the reference expression.

  This change affects the following AST nodes:

  - `MessageReference` now has an optional `attribute` field,
  - `FunctionReference` now has a required `arguments` field,
  - `TermReference` now has an optional `attribute` field and an optional
    `arguments` field.

- Remove `VariantLists`.

  The `VariantLists` and the `VariantExpression` syntax and AST nodes were
  deprecated in Syntax 0.9 and have now been removed.

- Rename `StringLiteral.raw` to `value`.

  `StringLiteral.value` contains the exact contents of the string literal,
  character-for-character. Escape sequences are stored verbatim without
  processing. A new method, `Literal.parse`, can be used to process the raw
  value of the literal into an unescaped form.

- Rename `args` to `arguments`.

  The `args` field of `MessageReference`, `TermReference`,
  `FunctionReference`, and `Annotation` has been renamed to `arguments`.

### Backward-incompatible changes:

- `VariantLists` are no longer valid syntax. A syntax error is reported
  when a `VariantList` or a `VariantExpression` is found in the parsed file.

## fluent-syntax 0.11.0 (March 25, 2019)

- Add `BaseNode.equals` and `BaseNode.clone`. (#172)

  The new `BaseNode` methods can be used to compare two nodes and to create
  a deep copy of an AST node.

- Add `Visitor` and `Transformer`. (#172)

  Add two new exports: `Visitor` for read-only iteration over AST trees,
  and `Transformer` for in-place mutation of AST trees.

- Export `serializeExpression` and `serializeVariantKey`. (#350)

  The `FluentSerializer.serializeExpression` method has been removed in
  favor of a module-wide stateless function `serializeExpression`.

## fluent-syntax 0.10.0 (December 13, 2018)

This release of `fluent-syntax` brings support for version 0.8 of the
Fluent Syntax spec. The API remains unchanged. Files written in valid
Syntax 0.7 may not parse correctly in this release. See the summary of
backwards-incompatible changes below.

- Implement Fluent Syntax 0.8. (#303)

  This is only a quick summary of the spec changes in Syntax 0.8. Consult the
  full [changelog][chlog0.8] for details.

  [chlog0.8]: https://github.com/projectfluent/fluent/releases/tag/v0.8.0

  In multiline `Patterns`, all common indent is now removed from each
  indented line in the final value of the pattern.

  ```properties
  multiline =
      This message has 2 spaces of indent
        on the second line of its value.
  ```

  `Terms` can now be parameterized via the call expression syntax.

  ```properties
  # A parametrized Term with a Pattern as a value.
  -thing = { $article ->
     *[definite] the thing
      [indefinite] a thing
  }

  this = This is { -thing(article: "indefinite") }.
  ```

  `VariantLists` are now deprecated and will be removed from the Syntax
  before version 1.0.

  All escapes sequences can only be used in `StringLiterals` now (see below).
  `\UHHHHHH` is a new escape sequence format suitable for codepoints above
  U+FFFF, e.g. `{"\U01F602"}`.

### Backward-incompatible changes:

- The backslash character (`\`) is now considered a regular character in
  `TextElements`. It's no longer possible to use escape sequences in
  `TextElements`. Please use `StringLiterals` instead, e.g. `{"\u00A0"}`.
- The closing curly brace character (`}`) is not allowed in `TextElements`
  now. Please use `StringLiterals` instead: `{"}"}`.
- `StringLiteral.value` was changed to store the unescaped ("cooked") value.
  `StringLiteral.raw` has been added to store the raw value.
- The AST of `CallExpressions` was changed to better accommodate the
  introduction of parameterized `Terms`. The `Function` AST node has been
  replaced by the `FunctionReference` node.
- The leading dash (`-`) is no longer part of the `Identifier` node in
  `Terms` and `TermReferences`.

## fluent-syntax 0.9.0 (October 23, 2018)

This release of `fluent-syntax` brings support for version 0.7 of the
Fluent Syntax spec. The API remains unchanged. Files written in valid
Syntax 0.6 may not parse correctly in this release. See the summary of
backwards-incompatible changes below.

- Implement Fluent Syntax 0.7. (#287)

  The major new feature of Syntax 0.7 is the relaxation of the indentation
  requirement for all non-text elements of patterns. It's finally possible
  to leave the closing brace of select expressions unindented:

      emails = { $unread_email_count ->
          [one] You have one unread email.
         *[other] You have { $unread_email_count } unread emails.
      }

  Consult the [changelog](https://github.com/projectfluent/fluent/releases/tag/v0.7.0)
  to learn about other changes in Syntax 0.7.

### Backward-incompatible changes:

- Variant keys can now be either `NumberLiterals` (as previously) or
  `Identifiers`. The `VariantName` node class has been removed. Variant
  keys with spaces in them produce syntax errors, e.g. `[New York]`.
- `CR` is not a valid EOL character anymore. Please use `LF` or `CRLF`.
- `Tab` is not recognized as syntax whitespace. It can only be used in
  translation content.

## fluent-syntax 0.8.1 (August 1, 2018)

### Bug fixes

- Avoid forEach to make code minification-friendly. (#263)
- Don't call charCodeAt() on undefined when at EOF. (#265)

## fluent-syntax 0.8.0 (July 24, 2018)

- Implement support for Fluent Syntax 0.6. (#253)

  Syntax 0.6 keeps the syntax unchanged but makes many changes to the AST.
  Consult https://github.com/projectfluent/fluent/releases/tag/v0.6.0
  for the list of changes.

- Drop support for IE and old evergreen browsers. (#133)

  Currently supported are: Firefox 52+, Chrome 55+, Edge 15+, Safari 10.1+,
  iOS Safari 10.3+ and node 8.9+.

## fluent-syntax 0.7.0 (April 17, 2018)

- Add the `ref` field to `VariantExpression`.

  The `Identifier`-typed `id` field of `VariantExpression` has been removed
  and replaced by an `Expression`-typed `ref` field. The new `ref` field
  can now hold `MessageReference` nodes. The range of valid expressions for
  `ref` may be extended in the future.

## fluent-syntax 0.6.6 (March 19, 2018)

- `Function` AST nodes have a span now. (#167)

## fluent-syntax 0.6.5 (March 8, 2018)

- Temporarily relax the `engines` requirement. (#164)

  Include node 6.9.\* LTS in the `engines` requirement to unblock
  [mozilla/addons-linter#1789][] and thus unblock langpack signing for
  Firefox 60.

  This is a temporary measure until `addons-linter` phases out the support
  for node 6 which should happen in May 2018.

  [mozilla/addons-linter#1789]: https://github.com/mozilla/addons-linter/issues/1789

## fluent-syntax 0.6.4 (March 7, 2018)

- Whitespace-only values are now correctly parsed as null. (#159)
- Correctly parse Patterns at EOF. (#159)
- Serialize values with Select Expression on a new line. (#161)

## fluent-syntax 0.6.2 (February 8, 2018)

- Inline Patterns may start with any character. (#150)

  `}`, `.`, `*` and `[` are only special when they appear at the beginning of
  indented Pattern lines. When a Pattern starts on the same line as `id =` or
  `[variant key]`, its first character doesn't carry any special meaning and
  it may be one of those four ones as well.

  This also fixes a regression from 0.6.0 where a message at the EOF without
  value nor attributes was incorrectly parsed as a message with an empty
  Pattern rather than produce a syntax error.

- Ensure CallExpression's args are always an array, even if empty.

## fluent-syntax 0.6.0 (January 31, 2018)

- Implement Fluent Syntax 0.5.

  - Add support for terms.
  - Add support for `#`, `##` and `###` comments.
  - Remove support for tags.
  - Add support for `=` after the identifier in message and term
    defintions.
  - Forbid newlines in string expressions.
  - Allow trailing comma in call expression argument lists.

  In fluent-syntax 0.6.x the new Syntax 0.5 is supported alongside the old
  Syntax 0.4. This should make migrations easier.

  `FluentParser` will correctly parse Syntax 0.4 comments (prefixed with
  `//`), sections and message definitions without the `=` after the
  identifier. The one exception are tags which are no longer supported.
  Please use attributed defined on terms instead.

  `FluentSerializer` always serializes using the new Syntax 0.5.

- Add `AST.Placeable` (#64)

  Added in Syntax Spec 0.4, `AST.Placeable` provides exact span data about
  the opening and closing brace of placeables.

- Expose `FluentSerializer.serializeExpression`. (#134)

- Serialize standalone comments with surrounding white-space.

- Allow blank lines inside of messages. (#76)

- Trim trailing newline from Comments. (#77)

## fluent-syntax 0.5.0 (June 23rd, 2017)

- Most AST nodes can now have a Span.

  Use `new FluentParser({ withSpans: true })` to enable this behavior.

- The `withAnnotations` config option to `FluentParser` has been removed.

  The parser always produces Annotations if necessary now.

## fluent-syntax 0.4.0 (May 17th, 2017)

- Introduce the FluentParser and the FluentSerializer classes.

  Instances can be used to store config for multiple parse/serialize
  operations.

  The fluent-syntax package still exports the `parse` and `serialize`
  helpers. For more fine-grained control, `FluentParser` and
  `FluentSerializer` may be used for instantiation.

- Build compat.js using babel-plugin-transform-builtin-extend.

  This ensures the correct behavior of `err instanceof ParseError`.

- The compat build is now transpiled using rollup-plugin-babel and
  babel-plugin-transform-builtin-extend.

  This ensures that the "use strict" pragma is scoped to the UMD wrapper. It
  also correctly parses the top-level "this" keyword (which the previous
  setup turned into "undefined").

## fluent-syntax 0.3.0

- JSON is now supported as a transport format for the AST.
- Annotations are now properly serialized and deserialized.
- Spans are now proper AST nodes with { start, end } fields.
- Added parseEntry and serializeEntry functions.

## fluent-syntax 0.2.0

- Updated parser to Fluent Syntax 0.3

  Added support for tags and indented multiline text. Removed quoted values.

- Added the Serializer module

  ```javascript
  import { parse } from "../src/parser";
  import { serialize } from "../src/serializer";

  function pretty(text) {
    const ast = parse(text);
    return serialize(ast);
  }
  ```

## fluent-syntax 0.1.1

- (fbfa521) Add spans and annotations to Entries

  The `parse` function no longer returns a [Resource, error] tuple. Instead
  it returns the Resource. Errors are now stored in the `annotations` field
  of each entry. Errors are instances of the `ParseError` class.

  `Entry` instances also gain the `span: { from, to }` field with indexes
  relative to the beginning of the file.

  `JunkEntry` is now called `Junk`.

  `lineOffset` and `columnOffset` are now available as named exports.

- (0f35313) Build AMD modules with names
- (de01c8b) Provide a compat version using babel-preset-latest

  Use it by importing from `fluent-syntax/compat'

## fluent-syntax 0.1.0

- (1a4f2a8) Make fluent and fluent-syntax separate packages
