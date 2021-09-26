import { not } from "logical-not";

export function replaceImports(importDeclarationPath) {
    if (not(isLibImport(importDeclarationPath))) return;

    importDeclarationPath.get("source").replaceWithSourceString(`
        "njectty/implementation"
    `);
}

function isLibImport(importDeclarationPath) {
    return importDeclarationPath.node.source.value === "njectty";
}
