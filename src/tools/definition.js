import { environment } from "../environment";

export class Definition {
    constructor(type, classDeclarationPath) {
        this.classDeclarationPath = classDeclarationPath;
        this.parameters = null;
        this.properties = [];
        this.type = type;
    }

    addParameter(name, value) {
        const { types: t } = environment.babel;

        this.properties.push(t.ObjectProperty(t.Identifier(name), value));
    }

    setParameters(parameters) {
        this.parameters = parameters;
    }

    insert() {
        const { types: t } = environment.babel;
        const { classDeclarationPath, properties, type } = this;
        const { name } = classDeclarationPath.node.id;

        const args = [t.Identifier(name)];

        if (properties.length > 0) args.push(t.ObjectExpression(properties));
        else if (this.parameters) args.push(this.parameters);

        classDeclarationPath.insertAfter(
            t.ExpressionStatement(t.CallExpression(t.Identifier(type), args))
        );
    }
}
