/**
 * @fileoverview ESLint helpers for checking sanitization
 * @author Frederik Braun et al.
 * @copyright 2015-2017 Mozilla Corporation. All rights reserved.
 */
"use strict";

// names of escaping functions that we acknowledge
const VALID_ESCAPERS = ["Sanitizer.escapeHTML", "escapeHTML"];
const VALID_UNWRAPPERS = ["Sanitizer.unwrapSafeHTML", "unwrapSafeHTML"];

/** Change this to class RuleHelper when <4.2.6 is no longer an issue
 *
 * @constructor
 * @param {Object} context ESLint configuration context
 * @param {Object} defaultRuleChecks Default rules to merge with
 * this.context
 *
 */
function RuleHelper(context, defaultRuleChecks) {
    this.context = context;
    this.ruleChecks = this.combineRuleChecks(defaultRuleChecks);
}

RuleHelper.prototype = {
    /**
     * Returns true if the expression contains allowed syntax, otherwise false.
     *
     * The function will be called recursively for Template Strings with interpolation
     * (e.g. `Hello ${name}`), Binary Expressions (e.g. |foo+bar|), and more.
     *
     * @param {Object} expression Checks whether this node is an allowed expression.
     * @param {Object} escapeObject contains keys "methods" and "taggedTemplates" which are arrays of strings
     *                              of matching escaping function names.
     * @param {Object} details Additional linter violation state information, in case this function was called
     *                         recursively.
     * @returns {boolean} Returns whether the expression is allowed.
     *
     */
    allowedExpression(expression, escapeObject, details) {
        if (!escapeObject) {
            escapeObject = {};
        }
        /*
        expression = { right-hand side of innerHTML or 2nd param to insertAdjacentHTML
        */
        let allowed;
        /* check the stringish-part, which is either the right-hand-side of
        an inner/outerHTML assignment or the 2nd parameter to insertAdjacentTML
        */


        switch(expression.type) {
        case"Literal":
            /*  surely, someone could have an evil literal in there, but that"s malice
            we can just check for unsafe coding practice, not outright malice
            example literal "<script>eval(location.hash.slice(1)</script>"
            (it"s the task of the tagger-function to be the gateway here.)
            */
            allowed = true;
            break;
        case "TemplateElement":
            // Raw text from a template
            allowed = true;
            break;
        case "TemplateLiteral":

            // check only the ${..} expressions
            allowed = this.allowedExpression(expression.expressions, escapeObject, details);
            break;
        case "TaggedTemplateExpression":
            allowed = this.isAllowedCallExpression(expression.tag, escapeObject.taggedTemplates || VALID_ESCAPERS);
            break;
        case "CallExpression":
            allowed = this.isAllowedCallExpression(expression.callee, escapeObject.methods || VALID_UNWRAPPERS);
            break;
        case "BinaryExpression":
            allowed = ((this.allowedExpression(expression.left, escapeObject, details))
                && (this.allowedExpression(expression.right, escapeObject, details)));
            break;
        case "TSAsExpression":
            // TSAsExpressions contain the raw javascript value in 'expression'
            allowed = this.allowedExpression(expression.expression, escapeObject, details);
            break;
        case "TypeCastExpression":
            allowed = this.allowedExpression(expression.expression, escapeObject, details);
            break;
        case "Identifier":
            allowed = this.isAllowedIdentifier(expression, escapeObject, details);
            break;
        default:

            // everything that doesn't match is considered unsafe:
            allowed = false;
            break;
        }
        if (Array.isArray(expression)) {
            allowed = expression.every((e) => this.allowedExpression(e, escapeObject, details));
        }
        return allowed;
    },

    /**
     * Check if an identifier is allowed
     * - only if variableTracing is enabled in the first place.
     * - find its declarations and see if it's const or let
     * - if so, allow if the declaring statement is an allowed expression
     * - ensure that following assignments to that identifier are also allowed
     *
     * @param {Object} expression Identifier expression
     * @param {Object} escapeObject contains keys "methods" and "taggedTemplates" which are arrays of strings
     *                              of matching escaping function names.
     * @param {Object} details Additional linter violation state information, in case this function was called
     *                         recursively.
     * @returns {boolean} Returns whether the Identifier is deemed safe.
     */
    isAllowedIdentifier(expression, escapeObject, details) {

        // respect the custom config property `variableTracing`:
        if (!this.ruleChecks["variableTracing"]) {
            return false;
        }

        // find declared variables and see which are literals
        const scope = this.context.getScope(expression);
        const variableInfo = scope.set.get(expression.name);
        let allowed = false;

        // If we can't get info on the variable, we just can't allow it
        if (!variableInfo ||
            !variableInfo.defs ||
            variableInfo.defs.length == 0 ||
            !variableInfo.references ||
            variableInfo.references.length == 0) {
            // FIXME Fix/Adjust towards a helpful message here and update tests accordingly.
            // details.message = `Variable ${expression.name} considered unsafe: variable initialization not found`;
            return false;
        }

        // look if the var was defined as allowable
        let definedAsAllowed = false;
        for (const def of variableInfo.defs) {
            if (def.node.type !== "VariableDeclarator") {
                // identifier wasn't declared as a variable
                // e.g., it shows up as a parameter to an
                // ArrowFunctionExpression, FunctionDeclaration or FunctionExpression
                const {line, column} = def.node.loc.start;
                if ((def.node.type === "FunctionDeclaration") || (def.node.type == "ArrowFunctionExpression") || (def.node.type === "FunctionExpression"))
                {
                    details.message = `Variable '${expression.name}' declared as function parameter, which is considered unsafe. '${def.node.type}' at ${line}:${column}`;
                } else {
                    details.message = `Variable '${expression.name}' initialized with unknown declaration '${def.node.type}' at ${line}:${column}`;
                }
                definedAsAllowed = false;
                break;
            }
            if ((def.kind !== "let") && (def.kind !== "const")) {
                // We do not allow for identifiers declared with "var", as they can be overridden in a
                // way that is hard for us to follow (e.g., assignments to globalThis[theirNameAsString]).
                definedAsAllowed = false;
                break;
            }

            // the `init` property carries the right-hand side of the variable definition:
            const varInitAs = def.node.init;

            // When the variable is only declared but not initialized, `init` is `null`.
            if (varInitAs && !this.allowedExpression(varInitAs, escapeObject, details)) {
                // if one variable definition is considered unsafe, all are.
                // NB: order of definition is unclear. See issue #168.
                if (!details.message) {
                    const {line, column} = varInitAs.loc.start;
                    details.message = `Variable '${expression.name}' initialized with unsafe value at ${line}:${column}`;
                }
                definedAsAllowed = false;
                break;
            }

            // keep iterating through other definitions.
            definedAsAllowed = true;
        }
        if (definedAsAllowed) {
            // the variable was declared as a safe value (e.g., literal)
            // now inspect writing references to that variable
            let allWritingRefsAllowed = false;

            // With no write variable references, if it was defined as allowed
            // then we should consider it safe.
            if (variableInfo.references.filter(ref => ref.isWrite()).length === 0) {
                allWritingRefsAllowed = true;
            }

            for (const ref of variableInfo.references) {
                // only look into writing references
                if (ref.isWrite()) {
                    const writeExpr = ref.writeExpr;

                    // if one is unsafe we'll consider all unsafe.
                    // this is because code occurring doesn't guarantee it being executed
                    // due to dynamic behavior if-conditions and such
                    if (!this.allowedExpression(writeExpr, escapeObject, details)) {
                        if (!details.message) {
                            const {line, column} = writeExpr.loc.start;
                            details.message = `Variable '${expression.name}' reassigned with unsafe value at ${line}:${column}`;
                        }
                        allWritingRefsAllowed = false;
                        break;
                    }
                    allWritingRefsAllowed = true;
                }
            }

            // allow this variable, because all writing references to it were allowed.
            allowed = allWritingRefsAllowed;
        }
        return allowed;
    },

    /**
     * Check if a callee is in the list allowed sanitizers
     *
     * @param {Object} callee Function that is being called expression.tag
     * or expression.callee
     * @param {Array} allowedSanitizers List of valid wrapping expressions
     * @returns {boolean} Returns whether call to the callee is allowed
     */
    isAllowedCallExpression(callee, allowedSanitizers) {
        const funcName = this.getCodeName(callee);
        let allowed = false;
        if (funcName && allowedSanitizers.indexOf(funcName) !== -1) {
            allowed = true;
        }
        return allowed;
    },

    /**
     * Captures safely any new node types that have been missed and throw when we don't support them
     * this normalizes the passed in identifier type to return the same shape
     *
     * @param {Object} node A callable expression to be simplified
     * @returns {Object} Method and (if applicable) object name
     */
    normalizeMethodCall(node) {
        let methodName;
        let objectName;
        switch (node.type) {
        case "Identifier":
            methodName = node.name;
            break;
        case "MemberExpression":
            methodName = node.property.name;
            objectName = node.object.name || this.context.getSource(node.object);
            break;
        case "ConditionalExpression":
        case "CallExpression":
        case "ArrowFunctionExpression":
            methodName = "";
            break;
        case "AssignmentExpression":
            methodName = this.normalizeMethodCall(node.right);
            break;
        case "Import":
            methodName = "import";
            break;
        default:
            this.reportUnsupported(node, "Unexpected callable", `unexpected ${node.type} in normalizeMethodCall`);
        }
        return {
            objectName,
            methodName
        };
    },

    /**
     * Returns functionName or objectName.methodName of an expression
     *
     * @param {Object} node A callable expression
     * @returns {String} A nice name to expression call
     */
    getCodeName(node) {
        const normalizedMethodCall = this.normalizeMethodCall(node);
        let codeName = normalizedMethodCall.methodName;
        if (normalizedMethodCall.objectName) {
            codeName = `${normalizedMethodCall.objectName}.${codeName}`;
        }
        return codeName;
    },

    /**
     * Checks to see if a method or function should be called
     * If objectMatches isn't present or blank array the code should not be checked
     * If we do have object filters and the call is a function then it should not be checked
     *
     * Checks if there are objectMatches we need to apply
     * @param {Object} node Call expression node
     * @param {Object} objectMatches Strings that are checked as regex to
     * match an object name
     * @returns {Boolean} Returns whether to run checks expression
     */
    shouldCheckMethodCall(node, objectMatches) {
        const normalizedMethodCall = this.normalizeMethodCall(node.callee);
        let matched = false;

        // Allow methods named "import":
        if (normalizedMethodCall.methodName === "import"
            && node.callee && node.callee.type === "MemberExpression") {
            return false;
        }

        // If objectMatches isn't present we should match all
        if (!objectMatches) {
            return true;
        }

        // if blank array the code should not be checked, this is a quick way to disable rules
        // TODO should we make this match all instead and let the $ruleCheck be false instead?
        if (objectMatches.length === 0) {
            return false;
        }

        // If we do have object filters and the call is a function then it should not be checked
        if ("objectName" in normalizedMethodCall && normalizedMethodCall.objectName) {
            for (const objectMatch of objectMatches) {
                const match = new RegExp(objectMatch, "gi");
                if (normalizedMethodCall.objectName.match(match)) {
                    matched = true;
                    break;
                }
            }
        }

        // if we don't have a objectName return false as bare function call
        // if we didn't match also return false
        return matched;
    },

    /**
     * Algorithm used to decide on merging ruleChecks with this.context
     * @param {Object} defaultRuleChecks Object containing default rules
     * @returns {Object} The merged ruleChecks
     */
    combineRuleChecks(defaultRuleChecks) {
        const parentRuleChecks = this.context.options[0] || {};
        let childRuleChecks = Object.assign({}, this.context.options[1]);
        const ruleCheckOutput = {};

        if (!("defaultDisable" in parentRuleChecks)
            || !parentRuleChecks.defaultDisable) {
            childRuleChecks = Object.assign({}, defaultRuleChecks, childRuleChecks);
        }

        // default to variable back tracing enabled.
        ruleCheckOutput["variableTracing"] = true;
        if ("variableTracing" in parentRuleChecks) {
            ruleCheckOutput["variableTracing"] = !!parentRuleChecks["variableTracing"];
        }

        // If we have defined child rules lets ignore default rules
        Object.keys(childRuleChecks).forEach((ruleCheckKey) => {
            // However if they have missing keys merge with default
            const ruleCheck = Object.assign(
                "defaultDisable" in parentRuleChecks ? {} :
                    {
                        escape: {
                            taggedTemplates: ["Sanitizer.escapeHTML", "escapeHTML"],
                            methods: ["Sanitizer.unwrapSafeHTML", "unwrapSafeHTML"]
                        }
                    },
                defaultRuleChecks[ruleCheckKey],
                parentRuleChecks,
                childRuleChecks[ruleCheckKey]);
            ruleCheckOutput[ruleCheckKey] = ruleCheck;
        });

        return ruleCheckOutput;
    },

    /**
     * Runs the checks against a CallExpression
     * @param {Object} node Call expression node
     * @returns {undefined} Does not return
     */
    checkMethod(node) {
        const normalizeMethodCall = this.normalizeMethodCall(node.callee);
        const methodName = normalizeMethodCall.methodName;

        if (Object.prototype.hasOwnProperty.call(this.ruleChecks, methodName)) {
            const ruleCheck = this.ruleChecks[methodName];
            if (!Array.isArray(ruleCheck.properties)) {
                this.context.report(node, `Method check requires properties array in eslint rule ${methodName}`);
                return;
            }
            ruleCheck.properties.forEach((propertyId) => {
                const argument = node.arguments[propertyId];
                if (!argument) {
                    // We bail out if arguments is supplied as a SpreadElement like `...args`
                    // It would be better if we tried a bit harder. That's #214
                    return;
                }
                const details = {};
                if (this.shouldCheckMethodCall(node, ruleCheck.objectMatches)
                    && !this.allowedExpression(argument, ruleCheck.escape, details)) {
                    // Include the additional details if available (e.g. name of a disallowed variable
                    // and the position of the expression that made it disallowed).
                    if (details.message) {
                        this.context.report(node, `Unsafe call to ${this.getCodeName(node.callee)} for argument ${propertyId} (${details.message})`);
                        return;
                    }
                    this.context.report(node, `Unsafe call to ${this.getCodeName(node.callee)} for argument ${propertyId}`);
                }
            });
        }
    },

    /**
     * Runs the checks against an assignment expression
     * @param {Object} node Assignment expression node
     * @returns {undefined} Does not return
     */
    checkProperty(node) {
        if (Object.prototype.hasOwnProperty.call(this.ruleChecks, node.left.property.name)) {
            const ruleCheck = this.ruleChecks[node.left.property.name];
            const details = {};
            if (!this.allowedExpression(node.right, ruleCheck.escape, details)) {
                // Include the additional details if available (e.g. name of a disallowed variable
                // and the position of the expression that made it disallowed).
                if (details.message) {
                    this.context.report(node, `Unsafe assignment to ${node.left.property.name} (${details.message})`);
                    return;
                }
                this.context.report(node, `Unsafe assignment to ${node.left.property.name}`);
            }
        }
    },

    reportUnsupported(node, reason, errorTitle) {
        const bugPath = `https://github.com/mozilla/eslint-plugin-no-unsanitized/issues/new?title=${encodeURIComponent(errorTitle)}`;
        this.context.report(node, `Error in no-unsanitized: ${reason}. Please report a minimal code snippet to the developers at ${bugPath}`);
    }

};

module.exports = RuleHelper;
