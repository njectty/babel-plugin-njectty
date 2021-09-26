import { not } from "logical-not";

import { processInjectParameters } from "./processors/inject-ts-parameters";
import { processInjectProperty } from "./processors/inject-ts-property";
import { processInjectable } from "./processors/injectable";
import { processModule } from "./processors/module";
import { processOptional } from "./processors/optional-ts";
import { replaceImports } from "./processors/replace-imports";
import { push } from "./tools/push-plugns";
import { environment } from "./environment";

export default function DIMTransformPlugin(babel, config) {
    environment.babel = babel;
    environment.config = parseConfig(config);

    return {
        name: "njectty-ts-plugin",

        manipulateOptions(_, { plugins }) {
            push(plugins, ["typescript", "decorators-legacy"]);
        },

        visitor: {
            Decorator(path) {
                processInjectable(path);
                processModule(path);
                processOptional(path);
            },

            ClassProperty(path) {
                processInjectProperty(path);
            },

            ClassMethod(path) {
                processInjectParameters(path);
            },

            ImportDeclaration(path) {
                replaceImports(path);
            },
        },
    };
}

function parseConfig(source) {
    if (not(source)) source = {};

    const config = {
        libPath: "njectty",
    };

    if (typeof source.libPath === "string") {
        config.libPath = source.libPath;
    }

    return config;
}
