import { not } from "logical-not";

import { test } from "../tools/test-decorator-path";

export function processOptional(decoratorPath) {
    if (not(test(decoratorPath, "Optional"))) return;

    throw decoratorPath.buildCodeFrameError("Error message here");
}
