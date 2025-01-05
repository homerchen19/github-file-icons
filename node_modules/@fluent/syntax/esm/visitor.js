import * as AST from "./ast.js";
/**
 * A read-only visitor.
 *
 * Subclasses can be used to gather information from an AST.
 *
 * To handle specific node types add methods like `visitPattern`.
 * Then, to descend into children call `genericVisit`.
 *
 * Visiting methods must implement the following interface:
 *
 * ```ts
 * interface VisitingMethod {
 *     (this: Visitor, node: AST.BaseNode): void;
 * }
 * ```
 */
export class Visitor {
    visit(node) {
        let visit = this[`visit${node.type}`];
        if (typeof visit === "function") {
            visit.call(this, node);
        }
        else {
            this.genericVisit(node);
        }
    }
    genericVisit(node) {
        for (const key of Object.keys(node)) {
            let prop = node[key];
            if (prop instanceof AST.BaseNode) {
                this.visit(prop);
            }
            else if (Array.isArray(prop)) {
                for (let element of prop) {
                    this.visit(element);
                }
            }
        }
    }
}
/**
 * A read-and-write visitor.
 *
 * Subclasses can be used to modify an AST in-place.
 *
 * To handle specific node types add methods like `visitPattern`.
 * Then, to descend into children call `genericVisit`.
 *
 * Visiting methods must implement the following interface:
 *
 * ```ts
 * interface TransformingMethod {
 *     (this: Transformer, node: AST.BaseNode): AST.BaseNode | undefined;
 * }
 * ```
 *
 * The returned node will replace the original one in the AST. Return
 * `undefined` to remove the node instead.
 */
export class Transformer extends Visitor {
    visit(node) {
        let visit = this[`visit${node.type}`];
        if (typeof visit === "function") {
            return visit.call(this, node);
        }
        return this.genericVisit(node);
    }
    genericVisit(node) {
        for (const key of Object.keys(node)) {
            let prop = node[key];
            if (prop instanceof AST.BaseNode) {
                let newVal = this.visit(prop);
                if (newVal === undefined) {
                    delete node[key];
                }
                else {
                    node[key] = newVal;
                }
            }
            else if (Array.isArray(prop)) {
                let newVals = [];
                for (let element of prop) {
                    let newVal = this.visit(element);
                    if (newVal !== undefined) {
                        newVals.push(newVal);
                    }
                }
                node[key] = newVals;
            }
        }
        return node;
    }
}
