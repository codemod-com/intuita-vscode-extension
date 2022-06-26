import {isNeitherNullNorUndefined} from "../utilities";
import {lookupNode} from "./nodeLookup";
import {Node, Project, VariableDeclarationKind} from "ts-morph";
import {Constructor, ConstructorReference} from "./getClassConstructors";
import {Group} from "../intuitaExtension/getGroupMap";

export const createNewExpressionVariableDeclaration = (
    project: Project,
    constructor: Constructor | null,
    reference: ConstructorReference,
    group: Group,
    className: string,
    index: number,
) => {
    const groupName = `${className}${index}`;

    const selectedParameterIndices: ReadonlySet<number> = new Set<number>(
        constructor
            ?.parameters
            .map(
                (parameter, index) =>
                    group.propertyNames.includes(parameter.name)
                        ? index
                        : null
            )
            .filter(isNeitherNullNorUndefined)
    );

    const selectedArguments = reference
        .arguments
        .filter((_, index) => selectedParameterIndices.has(index))
        .join(', ');

    const declarations = [
        {
            name: groupName.toLocaleLowerCase(),
            initializer: `new ${groupName}(${selectedArguments})`
        }
    ];

    lookupNode(
        project,
        reference.nodeLookupCriterion,
        true,
    )
        .filter(Node.isStatemented)
        .forEach(statementedNode => {
            statementedNode.insertVariableStatement(
                index,
                {
                    declarationKind: VariableDeclarationKind.Const,
                    declarations,
                }
            );
        });
}