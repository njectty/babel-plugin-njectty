import { not } from "logical-not";

import { InjectableProvider } from "../tools/injectable-provider";
import { test } from "../tools/test-decorator-path";
import { validate } from "../tools/validate";

const injectableOptionsProperties = ["global"];

export function processInjectable(decoratorPath) {
    if (not(test(decoratorPath, "Injectable"))) return;

    validate(decoratorPath, { parentNodeType: "ClassDeclaration" });

    const injectableProvider = InjectableProvider.getFor(decoratorPath);
    const options = getInjectableOptions(decoratorPath);

    if (options) injectableProvider.definition.addParameter("opts", options);

    injectableProvider.definition.insert();

    decoratorPath.remove();
}

function getInjectableOptions(decoratorPath) {
    const [options] = decoratorPath.get("expression").get("arguments");

    if (not(options)) return null;

    validate(options, {
        properties: injectableOptionsProperties,

        validate(path, key) {
            if (key === "global") {
                if (not(path.isBooleanLiteral()))
                    throw path.buildCodeFrameError("Error message here");
            }
        },
    });

    return options.node;
}
