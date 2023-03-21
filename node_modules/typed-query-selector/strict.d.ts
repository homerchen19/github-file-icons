import type { ParseSelectorToTagNames, TagNameToElement } from './parser'

// Specification is here: https://drafts.csswg.org/css-syntax-3/#ident-token-diagram
// but we don't plan to comply that fully,
// otherwise it will increase type-checking time and the complexity of parser.

type LowerCaseLetter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

type IdentifierFirstChar =
  | LowerCaseLetter
  | Uppercase<LowerCaseLetter>
  | '-'
  | '_'
type IdentifierChar = IdentifierFirstChar | Digit

type IsValidTags<S> = S extends [infer H, ...infer Rest]
  ? H extends '' | '*'
    ? IsValidTags<Rest>
    : IsValidTagName<H> extends true
    ? IsValidTags<Rest>
    : false
  : true
type IsValidTagName<S> = S extends `${infer H}${infer Rest}`
  ? H extends IdentifierFirstChar
    ? IsValidRestChars<Rest>
    : false
  : false
type IsValidRestChars<S extends string> = S extends `${infer H}${infer Rest}`
  ? H extends IdentifierChar
    ? IsValidRestChars<Rest>
    : false
  : true // no characters left, so it's OK

type Parse<S extends string> = ParseSelectorToTagNames<S> extends infer Tags
  ? Tags extends []
    ? TagNameToElement<''>
    : Tags extends string[]
    ? IsValidTags<Tags> extends true
      ? TagNameToElement<Tags[number]>
      : never
    : never
  : never

declare global {
  interface ParentNode {
    querySelector<S extends string, E extends Parse<S>>(
      selector: S,
    ): [E] extends [never] ? never : E | null

    querySelectorAll<S extends string, E extends Parse<S>>(
      selector: S,
    ): [E] extends [never] ? never : NodeListOf<E>
  }

  interface Element {
    closest<S extends string, E extends Parse<S>>(
      selector: S,
    ): [E] extends [never] ? never : E | null
  }
}
