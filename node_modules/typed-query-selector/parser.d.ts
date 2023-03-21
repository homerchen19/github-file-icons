type Whitespace = ' ' | '\n' | '\r' | '\f' | '\t'
type Trim<S extends string> = S extends `${infer T}${Whitespace}`
  ? Trim<T>
  : S extends `${Whitespace}${infer T}`
  ? Trim<T>
  : S

type Combinators = ' ' | '>' | '~' | '+'
type GetLastTag<I> = I extends `${string}${Combinators}${infer Right}`
  ? Right extends '' // right arm can't be empty
    ? unknown
    : GetLastTag<Right>
  : I

type PseudoClassesFirstChar =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'h'
  | 'i'
  | 'l'
  | 'n'
  | 'o'
  | 'p'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'

type Split<S> = S extends `${string},` // invalid selector
  ? unknown
  : S extends ''
  ? []
  : S extends `${infer Left},${infer Right}`
  ? [Left, ...Split<Right>]
  : [S]

type Join<Seq> = Seq extends []
  ? ''
  : Seq extends [infer Head, ...infer Rest]
  ? Head extends string
    ? `${Head}${Join<Rest>}`
    : never
  : never

type Quotes = '"' | "'"

// DO NOT use union type like `${infer L},${Whitespace}${infer R}` here,
// or it may cause OOM when running tsc in downstream projects.
type PreprocessGrouping<I> = I extends `${infer L}, ${infer R}`
  ? PreprocessGrouping<`${L},${R}`>
  : I extends `${infer L},\n${infer R}`
  ? PreprocessGrouping<`${L},${R}`>
  : I extends `${infer L},\r${infer R}`
  ? PreprocessGrouping<`${L},${R}`>
  : I extends `${infer L},\f${infer R}`
  ? PreprocessGrouping<`${L},${R}`>
  : I extends `${infer L},\t${infer R}`
  ? PreprocessGrouping<`${L},${R}`>
  : I

type Preprocess<I> = I extends `${infer L}\\${Quotes}${infer R}` // remove escaped quotes
  ? Preprocess<`${L}${R}`>
  : I extends `${infer L}"${string}"${infer R}` // remove quoted content in attribute
  ? Preprocess<`${L}${R}`>
  : I extends `${infer L}'${string}'${infer R}` // remove quoted content in attribute
  ? Preprocess<`${L}${R}`>
  : I extends `${string}[]${string}` // invalid selector
  ? unknown
  : I extends `${infer L}[${string}]${infer R}` // process attribute
  ? Preprocess<`${L}#x${R}`> // replace it with a fake ID selector
  : I

/** Parse `is:()` and `:where()` */
type ExpandFunctions<
  I,
  Seen = '',
  LeftParts extends string[] = [],
  Right extends string = '',
> = I extends `${infer L}:${infer Pseudo}(${infer Args})${infer R}`
  ? Pseudo extends 'is' | 'where'
    ? ExpandFunctions<R, Args, [...LeftParts, L], R>
    : ExpandFunctions<`${L}${R}`, Seen, LeftParts, R>
  : Join<Expander<Split<Seen>, Join<LeftParts>, Right>> extends `${infer S},`
  ? S
  : I
type Expander<Args, L extends string, R extends string> = Args extends []
  ? []
  : Args extends [infer Head, ...infer Rest]
  ? Head extends string
    ? [`${L}${Head}${R},`, ...Expander<Rest, L, R>]
    : never
  : never

/** Check whether each tag is valid or not. */
type Postprocess<
  Tags extends string[],
  R extends string[] = [],
> = Tags extends []
  ? R
  : Tags extends [infer H, ...infer Rest]
  ? PostprocessEach<GetLastTag<H>> extends infer T
    ? T extends string
      ? Rest extends string[]
        ? Postprocess<Rest, [...R, T]>
        : never
      : unknown
    : never
  : Tags
/** Postprocess each tag with simple validation. */
type PostprocessEach<I> = I extends `${infer Tag}.${infer Rest}`
  ? Rest extends '' // this can't be empty
    ? unknown
    : PostprocessEach<Tag>
  : I extends `${infer Tag}#${infer Rest}`
  ? Rest extends '' // this can't be empty
    ? unknown
    : PostprocessEach<Tag>
  : I extends `${infer Tag}:${PseudoClassesFirstChar}${string}`
  ? PostprocessEach<Tag>
  : I extends `${string}|${infer R}` // namespace prefix
  ? PostprocessEach<R>
  : I

/**
 * Internal type.
 * Use at your own risk, since we don't guarantee its signature and stability.
 */
export type ParseSelectorToTagNames<I extends string> = Trim<I> extends infer I
  ? I extends ''
    ? unknown
    : Split<
        ExpandFunctions<Preprocess<PreprocessGrouping<I>>>
      > extends infer PreprocessedTagNames
    ? PreprocessedTagNames extends string[]
      ? Postprocess<PreprocessedTagNames>
      : unknown
    : never
  : never

export type ParseSelector<
  I extends string,
  Fallback extends Element = Element,
> = ParseSelectorToTagNames<I> extends infer TagNames
  ? TagNames extends []
    ? TagNameToElement<'', Fallback>
    : TagNames extends string[]
    ? TagNameToElement<TagNames[number], Fallback>
    : Fallback
  : never

export type TagNameToElement<
  Tag extends string,
  Fallback extends Element = Element,
> = Tag extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[Tag]
  : Tag extends keyof SVGElementTagNameMap
  ? SVGElementTagNameMap[Tag]
  : Fallback
