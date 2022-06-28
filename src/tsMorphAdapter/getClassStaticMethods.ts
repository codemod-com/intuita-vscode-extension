import {
    ClassDeclaration, DecoratorStructure,
    ParameterDeclarationStructure,
    ts,
    TypeParameterDeclarationStructure
} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";
import {buildNodeLookupCriterion, NodeLookupCriterion} from "./nodeLookup";

export type StaticMethod = Readonly<{
    name: string,
    typeParameterDeclarations: ReadonlyArray<TypeParameterDeclarationStructure>,
    parameters: ReadonlyArray<ParameterDeclarationStructure>,
    returnType: string,
    bodyText: string | null,
    references: ReadonlyArray<
        Readonly<{
            criterion: NodeLookupCriterion,
            replacementText: string,
        }>
    >
}>;

export const getClassStaticMethod = (
    classDeclaration: ClassDeclaration,
): ReadonlyArray<StaticMethod> => {
    return classDeclaration
        .getStaticMethods()
        .map(
            (staticMethod) => {
                const name = staticMethod.getName();

                const typeParameterDeclarations = staticMethod
                    .getTypeParameters()
                    .map((tpd) => tpd.getStructure());

                const parameters = staticMethod
                    .getParameters()
                    .map(parameter => parameter.getStructure());

                const returnType = staticMethod
                    .getReturnTypeNode()
                    ?.getText() ?? 'void';

                const bodyText = staticMethod.getBodyText() ?? null;

                const references = staticMethod
                    .findReferences()
                    .flatMap((referencedSymbol) => referencedSymbol.getReferences())
                    .map((referencedSymbolEntry) => {
                        const node = referencedSymbolEntry.getNode();

                        const callExpression = node
                            .getFirstAncestorByKind(
                                ts.SyntaxKind.CallExpression
                            );

                        if (!callExpression) {
                            return null;
                        }

                        const text = callExpression.getText();

                        const criterion = buildNodeLookupCriterion(
                            callExpression.compilerNode,
                            (node, index, length) => {
                                if (index !== (length-1)) {
                                    return true;
                                }

                                return node.getText() === text;
                            }
                        );

                        let typeArguments = callExpression
                            .getTypeArguments()
                            .map(ta => ta.getText())
                            .join(', ');

                        typeArguments = typeArguments ? `<${typeArguments}>` : '';

                        const args = callExpression
                            .getArguments()
                            .map((arg) => arg.getText())
                            .join(', ');

                        const replacementText = `${staticMethod.getName()}${typeArguments}(${args})`;

                        return {
                            criterion,
                            replacementText,
                        };
                    })
                    .filter(isNeitherNullNorUndefined);

                return {
                    name,
                    typeParameterDeclarations,
                    parameters,
                    returnType,
                    bodyText,
                    references,
                };
            }
        );
};