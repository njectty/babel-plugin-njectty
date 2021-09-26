import { not } from "logical-not";

import { test } from "../tools/test-decorator-path";

export function processInjectProperty(propertyPath) {
    if (not(propertyPath.node.decorators)) return;

    const decoratorPath = getDecoratorPath(propertyPath);

    if (not(decoratorPath)) return;

    validate(propertyPath, decoratorPath);

    const token = getToken(propertyPath, decoratorPath);

    if (not(token))
        throw decoratorPath.buildCodeFrameError("Error message here");

    propertyPath.set("definite", false);
    propertyPath.get("value").replaceWithSourceString(`
        Inject(${token}${getConfig(propertyPath)})
    `);

    decoratorPath.remove();
}

function validate(propertyPath, decoratorPath) {
    const { node } = propertyPath;

    if (not(node.typeAnnotation))
        throw propertyPath.buildCodeFrameError("Error message here");

    if (not(hasToken(decoratorPath))) {
        const { typeAnnotation } = node.typeAnnotation;

        if (typeAnnotation.type !== "TSTypeReference")
            throw propertyPath.buildCodeFrameError("Error message here");

        if (typeAnnotation.typeName.type !== "Identifier")
            throw propertyPath.buildCodeFrameError("Error message here");
    }

    if (node.static)
        throw propertyPath.buildCodeFrameError("Error message here");

    if (node.value)
        throw propertyPath.buildCodeFrameError("Error message here");
}

function getDecoratorPath(propertyPath) {
    return propertyPath
        .get("decorators")
        .find((decoratorPath) => test(decoratorPath, "Inject"));
}

function getToken(propertyPath, decoratorPath) {
    if (hasToken(decoratorPath)) {
        const [node] = decoratorPath.node.expression.arguments;

        if (node.type !== "Identifier")
            throw propertyPath.buildCodeFrameError("Error message here");

        return node.name;
    } else {
        const { typeAnnotation } = propertyPath.node.typeAnnotation;

        return typeAnnotation.typeName.name;
    }
}

function getConfig(propertyPath) {
    const properties = [];

    if (propertyPath.node.optional) {
        properties.push("optional: true");
    }

    return properties.length > 0 ? `, {${properties.join(",")}}` : "";
}

function hasToken(decoratorPath) {
    return decoratorPath.node.expression.arguments.length === 1;
}
