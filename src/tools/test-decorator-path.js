import { not } from "logical-not";

export function test(decoratorPath, name) {
    if (decoratorPath.removed) return false;

    if (not(decoratorPath.findParent((path) => path.isClassDeclaration())))
        return false;

    const { expression } = decoratorPath.node;

    return (
        expression.type === "CallExpression" && expression.callee.name === name
    );
}
