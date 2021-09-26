import { not } from "logical-not";

import { Definition } from "./definition";

const instanceKey = Symbol();

export class InjectableProvider {
    static getFor(path) {
        const classDeclarationPath = path.findParent((path) =>
            path.isClassDeclaration()
        );

        if (not(classDeclarationPath.getData(instanceKey))) {
            const instance = Object.assign(new InjectableProvider(), {
                classDeclarationPath,
                definition: new Definition("Injectable", classDeclarationPath),
            });

            classDeclarationPath.setData(instanceKey, instance);
        }

        return classDeclarationPath.getData(instanceKey);
    }

    classDeclarationPath;
    definition;
}
