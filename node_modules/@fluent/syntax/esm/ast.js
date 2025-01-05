/**
 * Base class for all Fluent AST nodes.
 *
 * All productions described in the ASDL subclass BaseNode, including Span and
 * Annotation.
 *
 */
export class BaseNode {
    equals(other, ignoredFields = ["span"]) {
        const thisKeys = new Set(Object.keys(this));
        const otherKeys = new Set(Object.keys(other));
        if (ignoredFields) {
            for (const fieldName of ignoredFields) {
                thisKeys.delete(fieldName);
                otherKeys.delete(fieldName);
            }
        }
        if (thisKeys.size !== otherKeys.size) {
            return false;
        }
        for (const fieldName of thisKeys) {
            if (!otherKeys.has(fieldName)) {
                return false;
            }
            const thisVal = this[fieldName];
            const otherVal = other[fieldName];
            if (typeof thisVal !== typeof otherVal) {
                return false;
            }
            if (thisVal instanceof Array && otherVal instanceof Array) {
                if (thisVal.length !== otherVal.length) {
                    return false;
                }
                for (let i = 0; i < thisVal.length; ++i) {
                    if (!scalarsEqual(thisVal[i], otherVal[i], ignoredFields)) {
                        return false;
                    }
                }
            }
            else if (!scalarsEqual(thisVal, otherVal, ignoredFields)) {
                return false;
            }
        }
        return true;
    }
    clone() {
        function visit(value) {
            if (value instanceof BaseNode) {
                return value.clone();
            }
            if (Array.isArray(value)) {
                return value.map(visit);
            }
            return value;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const clone = Object.create(this.constructor.prototype);
        for (const prop of Object.keys(this)) {
            clone[prop] = visit(this[prop]);
        }
        return clone;
    }
}
function scalarsEqual(thisVal, otherVal, ignoredFields) {
    if (thisVal instanceof BaseNode && otherVal instanceof BaseNode) {
        return thisVal.equals(otherVal, ignoredFields);
    }
    return thisVal === otherVal;
}
/**
 * Base class for AST nodes which can have Spans.
 */
export class SyntaxNode extends BaseNode {
    /** @ignore */
    addSpan(start, end) {
        this.span = new Span(start, end);
    }
}
export class Resource extends SyntaxNode {
    constructor(body = []) {
        super();
        this.type = "Resource";
        this.body = body;
    }
}
export class Message extends SyntaxNode {
    constructor(id, value = null, attributes = [], comment = null) {
        super();
        this.type = "Message";
        this.id = id;
        this.value = value;
        this.attributes = attributes;
        this.comment = comment;
    }
}
export class Term extends SyntaxNode {
    constructor(id, value, attributes = [], comment = null) {
        super();
        this.type = "Term";
        this.id = id;
        this.value = value;
        this.attributes = attributes;
        this.comment = comment;
    }
}
export class Pattern extends SyntaxNode {
    constructor(elements) {
        super();
        this.type = "Pattern";
        this.elements = elements;
    }
}
export class TextElement extends SyntaxNode {
    constructor(value) {
        super();
        this.type = "TextElement";
        this.value = value;
    }
}
export class Placeable extends SyntaxNode {
    constructor(expression) {
        super();
        this.type = "Placeable";
        this.expression = expression;
    }
}
// An abstract base class for Literals.
export class BaseLiteral extends SyntaxNode {
    constructor(value) {
        super();
        // The "value" field contains the exact contents of the literal,
        // character-for-character.
        this.value = value;
    }
}
export class StringLiteral extends BaseLiteral {
    constructor() {
        super(...arguments);
        this.type = "StringLiteral";
    }
    parse() {
        // Backslash backslash, backslash double quote, uHHHH, UHHHHHH.
        const KNOWN_ESCAPES = /(?:\\\\|\\"|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
        function fromEscapeSequence(match, codepoint4, codepoint6) {
            switch (match) {
                case "\\\\":
                    return "\\";
                case '\\"':
                    return '"';
                default: {
                    let codepoint = parseInt(codepoint4 || codepoint6, 16);
                    if (codepoint <= 0xd7ff || 0xe000 <= codepoint) {
                        // It's a Unicode scalar value.
                        return String.fromCodePoint(codepoint);
                    }
                    // Escape sequences reresenting surrogate code points are
                    // well-formed but invalid in Fluent. Replace them with U+FFFD
                    // REPLACEMENT CHARACTER.
                    return "�";
                }
            }
        }
        let value = this.value.replace(KNOWN_ESCAPES, fromEscapeSequence);
        return { value };
    }
}
export class NumberLiteral extends BaseLiteral {
    constructor() {
        super(...arguments);
        this.type = "NumberLiteral";
    }
    parse() {
        let value = parseFloat(this.value);
        let decimalPos = this.value.indexOf(".");
        let precision = decimalPos > 0 ? this.value.length - decimalPos - 1 : 0;
        return { value, precision };
    }
}
export class MessageReference extends SyntaxNode {
    constructor(id, attribute = null) {
        super();
        this.type = "MessageReference";
        this.id = id;
        this.attribute = attribute;
    }
}
export class TermReference extends SyntaxNode {
    constructor(id, attribute = null, args = null) {
        super();
        this.type = "TermReference";
        this.id = id;
        this.attribute = attribute;
        this.arguments = args;
    }
}
export class VariableReference extends SyntaxNode {
    constructor(id) {
        super();
        this.type = "VariableReference";
        this.id = id;
    }
}
export class FunctionReference extends SyntaxNode {
    constructor(id, args) {
        super();
        this.type = "FunctionReference";
        this.id = id;
        this.arguments = args;
    }
}
export class SelectExpression extends SyntaxNode {
    constructor(selector, variants) {
        super();
        this.type = "SelectExpression";
        this.selector = selector;
        this.variants = variants;
    }
}
export class CallArguments extends SyntaxNode {
    constructor(positional = [], named = []) {
        super();
        this.type = "CallArguments";
        this.positional = positional;
        this.named = named;
    }
}
export class Attribute extends SyntaxNode {
    constructor(id, value) {
        super();
        this.type = "Attribute";
        this.id = id;
        this.value = value;
    }
}
export class Variant extends SyntaxNode {
    constructor(key, value, def) {
        super();
        this.type = "Variant";
        this.key = key;
        this.value = value;
        this.default = def;
    }
}
export class NamedArgument extends SyntaxNode {
    constructor(name, value) {
        super();
        this.type = "NamedArgument";
        this.name = name;
        this.value = value;
    }
}
export class Identifier extends SyntaxNode {
    constructor(name) {
        super();
        this.type = "Identifier";
        this.name = name;
    }
}
export class BaseComment extends SyntaxNode {
    constructor(content) {
        super();
        this.content = content;
    }
}
export class Comment extends BaseComment {
    constructor() {
        super(...arguments);
        this.type = "Comment";
    }
}
export class GroupComment extends BaseComment {
    constructor() {
        super(...arguments);
        this.type = "GroupComment";
    }
}
export class ResourceComment extends BaseComment {
    constructor() {
        super(...arguments);
        this.type = "ResourceComment";
    }
}
export class Junk extends SyntaxNode {
    constructor(content) {
        super();
        this.type = "Junk";
        this.annotations = [];
        this.content = content;
    }
    addAnnotation(annotation) {
        this.annotations.push(annotation);
    }
}
export class Span extends BaseNode {
    constructor(start, end) {
        super();
        this.type = "Span";
        this.start = start;
        this.end = end;
    }
}
export class Annotation extends SyntaxNode {
    constructor(code, args = [], message) {
        super();
        this.type = "Annotation";
        this.code = code;
        this.arguments = args;
        this.message = message;
    }
}
