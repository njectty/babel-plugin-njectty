import { not } from "logical-not";

export function validate(
    decoratorPath,
    { argumentsCount, argumentsNodeType, parentNodeType }
) {
    if (parentNodeType && decoratorPath.parent.type !== parentNodeType) {
        throw decoratorPath.buildCodeFrameError("Error message here");
    }

    const expressionPath = decoratorPath.get("expression");

    if (typeof argumentsCount === "number") {
        checkArgumentsCount(expressionPath, argumentsCount);
    }

    if (Array.isArray(argumentsNodeType)) {
        if (typeof argumentsCount !== "number")
            checkArgumentsCount(expressionPath, argumentsNodeType.length);

        const argumentPathArray = expressionPath.get("arguments");

        argumentsNodeType.forEach((nodeType, i) =>
            checkArgumentNodeType(argumentPathArray[i], nodeType)
        );
    }
}

function checkArgumentsCount(expressionPath, expected) {
    const target = expressionPath.get("arguments").length;

    if (target !== expected)
        throw expressionPath.buildCodeFrameError("Error message here");
}

function checkArgumentNodeType(argumentPath, expected) {
    if (argumentPath.node.type !== expected)
        throw argumentPath.buildCodeFrameError("Error message here");
}

export function validateObjectExpression(path, { properties, validate }) {
    if (not(path.isObjectExpression()))
        throw path.buildCodeFrameError("Error message here");

    let hasProperty = false;

    path.get("properties").forEach((property) => {
        const { name } = property.node.key;

        if (properties.includes(name)) {
            if (validate) validate(property.get("value"), name);

            hasProperty = true;
        } else property.remove();
    });

    if (not(hasProperty)) throw path.buildCodeFrameError("Error message here");
}
