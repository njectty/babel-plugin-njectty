import { not } from "logical-not";

import { environment } from "../environment";
import { test } from "../tools/test-decorator-path";
import { validate } from "../tools/validate";
import { processInject } from "./inject";

export function processOptional(decoratorPath) {
    if (not(test(decoratorPath, "Optional"))) return;

    validate(decoratorPath, {
        argumentsCount: 0,
        parentNodeType: "ClassProperty",
    });

    if (not(decoratorPath.parent.value)) processInjectDecorator(decoratorPath);

    const injectFnPath = decoratorPath.parentPath.get("value");
    const { types: t } = environment.babel;

    checkInjectFn: {
        const {
            type,
            callee,
            arguments: { length: argumentsLength },
        } = injectFnPath.node;

        if (type !== "CallExpression" || callee.name !== "Inject")
            throw decoratorPath.buildCodeFrameError("Error message here");

        if (argumentsLength === 1)
            injectFnPath.pushContainer("arguments", t.ObjectExpression([]));
    }

    const [, objectPath] = injectFnPath.get("arguments");

    if (not(objectPath) || objectPath.node.type !== "ObjectExpression")
        throw decoratorPath.buildCodeFrameError("Error message here");

    objectPath.pushContainer(
        "properties",
        t.ObjectProperty(t.Identifier("optional"), t.BooleanLiteral(true))
    );

    decoratorPath.remove();
}

function processInjectDecorator(optionalDecoratorPath) {
    const injectDecorator = optionalDecoratorPath.parentPath
        .get("decorators")
        .forEach((decoratorPath) => {
            if (decoratorPath !== optionalDecoratorPath)
                processInject(decoratorPath);
        });
}
