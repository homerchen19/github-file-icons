"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeResolver = void 0;
const enhanced_resolve_1 = require("enhanced-resolve");
function makeResolver(options) {
    return enhanced_resolve_1.create.sync(options.resolve);
}
exports.makeResolver = makeResolver;
//# sourceMappingURL=resolver.js.map