import { not } from "logical-not";
import { Definition } from "../tools/definition";

import { test } from "../tools/test-decorator-path";
import { validate, validateObjectExpression } from "../tools/validate";

const moduleConfigProperties = ["imports", "exports", "injects"];

export function processModule(decoratorPath) {
    if (not(test(decoratorPath, "Module"))) return;

    validate(decoratorPath, {
        parentNodeType: "ClassDeclaration",
    });

    const classDeclarationPath = decoratorPath.parentPath;
    const definition = new Definition("Module", classDeclarationPath);

    definition.setParameters(getConfig(decoratorPath));
    definition.insert();

    decoratorPath.remove();
}

function getConfig(decoratorPath) {
    switch (decoratorPath.node.expression.arguments.length) {
        case 0:
            return null;
        case 1: {
            const [config] = decoratorPath.get("expression").get("arguments");

            validateObjectExpression(config, {
                properties: moduleConfigProperties,

                validate(arrayExpressionPath) {
                    const {
                        node: { type, elements },
                    } = arrayExpressionPath;

                    if (type !== "ArrayExpression")
                        throw arrayExpressionPath.buildCodeFrameError(
                            "Error message here"
                        );

                    if (elements.length === 0)
                        throw arrayExpressionPath.buildCodeFrameError(
                            "Error message here"
                        );
                },
            });

            return config.node;
        }
        default:
            throw decoratorPath.buildCodeFrameError("Error message here");
    }
}
