import { FluentParser } from "./parser.js";
import { FluentSerializer } from "./serializer.js";
export * from "./ast.js";
export { ParseError } from "./errors.js";
export { serializeExpression, serializeVariantKey } from "./serializer.js";
export { Transformer, Visitor } from "./visitor.js";
export { FluentParser, FluentSerializer, };
export function parse(source, opts) {
    const parser = new FluentParser(opts);
    return parser.parse(source);
}
export function serialize(resource, opts) {
    const serializer = new FluentSerializer(opts);
    return serializer.serialize(resource);
}
export function lineOffset(source, pos) {
    // Subtract 1 to get the offset.
    return source.substring(0, pos).split("\n").length - 1;
}
export function columnOffset(source, pos) {
    // Find the last line break starting backwards from the index just before
    // pos.  This allows us to correctly handle ths case where the character at
    // pos  is a line break as well.
    const fromIndex = pos - 1;
    const prevLineBreak = source.lastIndexOf("\n", fromIndex);
    // pos is a position in the first line of source.
    if (prevLineBreak === -1) {
        return pos;
    }
    // Subtracting two offsets gives length; subtract 1 to get the offset.
    return pos - prevLineBreak - 1;
}
