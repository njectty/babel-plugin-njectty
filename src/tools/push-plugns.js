import { not } from "logical-not";

export function push(target, plugins) {
    plugins.forEach((plugin) => {
        if (not(target.includes(plugin))) {
            target.push(plugin);
        }
    });
}
