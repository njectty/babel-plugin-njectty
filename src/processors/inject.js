import { not } from "logical-not";

import { test } from "../tools/test-decorator-path";
import { validate } from "../tools/validate";

export function processInject(decoratorPath) {
    if (not(test(decoratorPath, "Inject"))) return;

    validate(decoratorPath, {
        argumentsNodeType: ["Identifier"],
        parentNodeType: "ClassProperty",
    });

    const classPropertyValuePath = decoratorPath.parentPath.get("value");
    const [tokenNode] = decoratorPath.node.expression.arguments;

    classPropertyValuePath.replaceWithSourceString(`Inject(${tokenNode.name})`);

    decoratorPath.remove();
}
