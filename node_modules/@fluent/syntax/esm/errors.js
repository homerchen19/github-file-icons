/* eslint-disable @typescript-eslint/restrict-template-expressions */
export class ParseError extends Error {
    constructor(code, ...args) {
        super();
        this.code = code;
        this.args = args;
        this.message = getErrorMessage(code, args);
    }
}
/* eslint-disable complexity */
function getErrorMessage(code, args) {
    switch (code) {
        case "E0001":
            return "Generic error";
        case "E0002":
            return "Expected an entry start";
        case "E0003": {
            const [token] = args;
            return `Expected token: "${token}"`;
        }
        case "E0004": {
            const [range] = args;
            return `Expected a character from range: "${range}"`;
        }
        case "E0005": {
            const [id] = args;
            return `Expected message "${id}" to have a value or attributes`;
        }
        case "E0006": {
            const [id] = args;
            return `Expected term "-${id}" to have a value`;
        }
        case "E0007":
            return "Keyword cannot end with a whitespace";
        case "E0008":
            return "The callee has to be an upper-case identifier or a term";
        case "E0009":
            return "The argument name has to be a simple identifier";
        case "E0010":
            return "Expected one of the variants to be marked as default (*)";
        case "E0011":
            return 'Expected at least one variant after "->"';
        case "E0012":
            return "Expected value";
        case "E0013":
            return "Expected variant key";
        case "E0014":
            return "Expected literal";
        case "E0015":
            return "Only one variant can be marked as default (*)";
        case "E0016":
            return "Message references cannot be used as selectors";
        case "E0017":
            return "Terms cannot be used as selectors";
        case "E0018":
            return "Attributes of messages cannot be used as selectors";
        case "E0019":
            return "Attributes of terms cannot be used as placeables";
        case "E0020":
            return "Unterminated string expression";
        case "E0021":
            return "Positional arguments must not follow named arguments";
        case "E0022":
            return "Named arguments must be unique";
        case "E0024":
            return "Cannot access variants of a message.";
        case "E0025": {
            const [char] = args;
            return `Unknown escape sequence: \\${char}.`;
        }
        case "E0026": {
            const [sequence] = args;
            return `Invalid Unicode escape sequence: ${sequence}.`;
        }
        case "E0027":
            return "Unbalanced closing brace in TextElement.";
        case "E0028":
            return "Expected an inline expression";
        case "E0029":
            return "Expected simple expression as selector";
        default:
            return code;
    }
}
