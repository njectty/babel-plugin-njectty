import { not } from "logical-not";

import { InjectableProvider } from "../tools/injectable-provider";
import { test } from "../tools/test-decorator-path";
import { environment } from "../environment";

export function processInjectParameters(methodPath) {
    if (not(methodPath.node.key.name === "constructor")) return;

    const { types: t } = environment.babel;

    const args = [];
    const argsOptions = [];

    methodPath.get("params").forEach((path) => {
        const injectDecoratorPath = getInjectDecoratorPath(path);
        const identifierPath = path.isTSParameterProperty()
            ? path.get("parameter")
            : path;

        if (injectDecoratorPath) {
            const [identifierNode] =
                injectDecoratorPath.node.expression.arguments;

            if (identifierNode.type !== "Identifier")
                throw injectDecoratorPath
                    .get("expression")
                    .get("arguments")[0]
                    .buildCodeFrameError("Error message here");

            args.push(identifierNode);

            injectDecoratorPath.remove();
        } else args.push(getToken(identifierPath));

        argsOptions.push(
            identifierPath.node.optional
                ? t.ObjectExpression([
                      t.ObjectProperty(
                          t.Identifier("optional"),
                          t.BooleanLiteral(true)
                      ),
                  ])
                : t.NullLiteral()
        );
    });

    if (args.length === 0) return;

    const injectableProvider = InjectableProvider.getFor(methodPath);

    injectableProvider.definition.addParameter("args", t.ArrayExpression(args));
    injectableProvider.definition.addParameter(
        "argsOptions",
        t.ArrayExpression(argsOptions)
    );
}

function getInjectDecoratorPath(path) {
    const decorators = path.get("decorators");

    if (not(Array.isArray(decorators))) return null;

    return path
        .get("decorators")
        .find((decoratorPath) => test(decoratorPath, "Inject"));
}

function getToken(path) {
    let { typeAnnotation } = path.node;

    if (not(typeAnnotation))
        throw path.buildCodeFrameError("Error message here");

    typeAnnotation = typeAnnotation.typeAnnotation;

    if (typeAnnotation.type !== "TSTypeReference")
        throw path
            .get("typeAnnotation")
            .buildCodeFrameError("Error message here");

    if (typeAnnotation.typeName.type !== "Identifier")
        throw decoratorPath.buildCodeFrameError("Error message here");

    return typeAnnotation.typeName;
}
