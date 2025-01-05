/**
 * @fileoverview ESLint rule to disallow unsanitized method calls
 * @author Frederik Braun et al.
 * @copyright 2015-2017 Mozilla Corporation. All rights reserved.
 */
"use strict";

const RuleHelper = require("../ruleHelper");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


const defaultRuleChecks = {

    // check second parameter to .insertAdjacentHTML()
    insertAdjacentHTML: {
        properties: [1]
    },


    // check first parameter of import()
    import: {
        properties: [0]
    },

    // check first parameter to createContextualFragment()
    createContextualFragment: {
        properties: [0]
    },

    // check first parameter to .write(), as long as the preceeding object matches the regex "document"
    write: {
        objectMatches: [
            "document"
        ],
        properties: [0]
    },

    // check first parameter to .writeLn(), as long as the preceeding object matches the regex "document"
    writeln: {
        objectMatches: [
            "document"
        ],
        properties: [0]
    }
};

/**
 * On newer parsers, `import(foo)` gets parsed as a keyword.
 * @param {Object} ruleHelper a RuleHelper instance
 * @param {Object} importExpr The ImportExpression we triggered on
 * @returns {undefined} Does not return
 */
function checkImport(ruleHelper, importExpr) {
    const fakeCall = {callee: {type: "Import"}, arguments: [importExpr.source]};
    Object.assign(fakeCall, importExpr);
    ruleHelper.checkMethod(fakeCall);
}

/**
 * Run ruleHelper.checkMethod for all but irrelevant callees (FunctionExpression, etc.)
 * @param {Object} ruleHelper a RuleHelper instance
 * @param {Object} callExpr The CallExpression we triggered on
 * @param {Object} node The callee node
 * @returns {undefined} Does not return
 */
function checkCallExpression(ruleHelper, callExpr, node) {
    switch(node.type) {
    case "Identifier":
    case "MemberExpression":
        if (callExpr.arguments && callExpr.arguments.length > 0) {
            ruleHelper.checkMethod(callExpr);
        }
        break;

    case "TSNonNullExpression": {
        const newCallExpr = Object.assign({}, callExpr);
        newCallExpr.callee = node.expression;
        checkCallExpression(ruleHelper, newCallExpr, node.expression);
        break;
    }

    case "TaggedTemplateExpression": {
        const newCallExpr = Object.assign({}, callExpr);
        newCallExpr.callee = node.tag;
        const expressions = node.quasi.expressions;
        const strings = node.quasi.quasis;
        newCallExpr.arguments = [strings, ...expressions];
        checkCallExpression(ruleHelper, newCallExpr, node.tag);
        break;
    }
        
    case "TypeCastExpression": {
        const newCallExpr = Object.assign({}, callExpr);
        newCallExpr.callee = node.expression;
        checkCallExpression(ruleHelper, newCallExpr, node.expression);
        break;
    }

    case "AssignmentExpression":
        if (node.right.type === "MemberExpression") {
            const newCallExpr = Object.assign({}, callExpr);
            newCallExpr.callee = node.right;
            checkCallExpression(ruleHelper, newCallExpr, node.right);
            break;
        }
        checkCallExpression(ruleHelper, callExpr, node.right);
        break;

    case "Import":
        ruleHelper.checkMethod(callExpr);
        break;

    case "SequenceExpression": {
        // the return value of a SequenceExpression is the last expression.
        // So, we create a new mock CallExpression with the actually called
        // ... expression as the callee node and pass it to checkMethod()

        const newCallExpr = Object.assign({}, callExpr);
        const idx = node.expressions.length - 1;
        const called = node.expressions[idx];
        newCallExpr.callee = called;
        ruleHelper.checkMethod(newCallExpr);
        break;
    }

    case "TSAsExpression":
        break;

    // those are fine:
    case "LogicalExpression": // Should we scan these? issue #62.
    case "ConditionalExpression":
    case "ArrowFunctionExpression":
    case "FunctionExpression":
    case "Super":
    case "CallExpression":
    case "ThisExpression":
    case "NewExpression":
    case "TSTypeAssertion":
    case "AwaitExpression": // see issue #122
        break;

    // If we don't cater for this expression throw an error
    default:
        ruleHelper.reportUnsupported(node, "Unexpected Callee", `Unsupported Callee of type ${node.type} for CallExpression`);
    }
}

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "ESLint rule to disallow unsanitized method calls",
            category: "possible-errors",
            url: "https://github.com/mozilla/eslint-plugin-no-unsanitized/tree/master/docs/rules/method.md"
        },
        /* schema statement TBD until we have options
        schema: [
            {
                type: array
            }
        ]*/
    },
    create(context) {
        const ruleHelper = new RuleHelper(context, defaultRuleChecks);
        return {
            CallExpression(node) {
                checkCallExpression(ruleHelper, node, node.callee);
            },
            ImportExpression(node) {
                checkImport(ruleHelper, node);
            },

            // Tagged template expressions pass arguments in a special format we need to
            // map to our existing function call logic
            // foo`bar${var1}${var2}` will run as foo(['bar', ''], var1, var2)
            TaggedTemplateExpression(node) {
                const newCallExpr = Object.assign({}, node);
                newCallExpr.callee = node.tag;
                const expressions = node.quasi.expressions;
                const strings = node.quasi.quasis;
                newCallExpr.arguments = [strings, ...expressions];
                checkCallExpression(ruleHelper, newCallExpr, node.tag);
            },
        };
    }
};
