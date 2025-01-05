export declare class ParserStream {
    string: string;
    index: number;
    peekOffset: number;
    constructor(string: string);
    charAt(offset: number): string;
    currentChar(): string;
    currentPeek(): string;
    next(): string;
    peek(): string;
    resetPeek(offset?: number): void;
    skipToPeek(): void;
}
export declare const EOL = "\n";
export declare const EOF: undefined;
export declare class FluentParserStream extends ParserStream {
    peekBlankInline(): string;
    skipBlankInline(): string;
    peekBlankBlock(): string;
    skipBlankBlock(): string;
    peekBlank(): void;
    skipBlank(): void;
    expectChar(ch: string): void;
    expectLineEnd(): void;
    takeChar(f: (ch: string) => boolean): string | null | typeof EOF;
    isCharIdStart(ch: string): boolean;
    isIdentifierStart(): boolean;
    isNumberStart(): boolean;
    isCharPatternContinuation(ch: string): boolean;
    isValueStart(): boolean;
    isValueContinuation(): boolean;
    /**
     * @param level - -1: any, 0: comment, 1: group comment, 2: resource comment
     */
    isNextLineComment(level?: number): boolean;
    isVariantStart(): boolean;
    isAttributeStart(): boolean;
    skipToNextEntryStart(junkStart: number): void;
    takeIDStart(): string;
    takeIDChar(): string | null | typeof EOF;
    takeDigit(): string | null | typeof EOF;
    takeHexDigit(): string | null | typeof EOF;
}
