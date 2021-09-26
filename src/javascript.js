import { environment } from "./environment";
import { processInject } from "./processors/inject";
import { processInjectable } from "./processors/injectable";
import { processModule } from "./processors/module";
import { processOptional } from "./processors/optional";
import { replaceImports } from "./processors/replace-imports";
import { push } from "./tools/push-plugns";

export default function DIMTransformPlugin(babel, config) {
    environment.babel = babel;
    environment.config = config;

    return {
        name: "njectty-js-plugin",

        manipulateOptions(_, { plugins }) {
            push(plugins, ["decorators-legacy"]);
        },

        visitor: {
            Decorator(path) {
                processInject(path);
                processInjectable(path);
                processModule(path);
                processOptional(path);
            },

            ImportDeclaration(path) {
                replaceImports(path);
            },
        },
    };
}
