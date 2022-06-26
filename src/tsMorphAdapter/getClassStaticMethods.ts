import {
    CallExpression,
    ClassDeclaration,
    MethodDeclaration,
    ParameterDeclarationStructure,
    SourceFile,
    ts,
    TypeParameterDeclarationStructure
} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export type StaticMethod = Readonly<{
    name: string,
    typeParameterDeclarations: ReadonlyArray<TypeParameterDeclarationStructure>,
    parameters: ReadonlyArray<ParameterDeclarationStructure>,
    returnType: string,
    bodyText: string | null,
    references: ReadonlyArray<
        Readonly<{
            sourceFile: SourceFile,
            callExpression: CallExpression,
            text: string,
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
                        const sourceFile = referencedSymbolEntry.getSourceFile();
                        const node = referencedSymbolEntry.getNode();

                        const callExpression = node
                            .getFirstAncestorByKind(
                                ts.SyntaxKind.CallExpression
                            );

                        if (!callExpression) {
                            return null;
                        }

                        let typeArguments = callExpression
                            .getTypeArguments()
                            .map(ta => ta.getText())
                            .join(', ');

                        typeArguments = typeArguments ? `<${typeArguments}>` : '';

                        const args = callExpression
                            .getArguments()
                            .map((arg) => arg.getText())
                            .join(', ');

                        // TODO: maybe there's a programmatic way to do this?
                        const text = `${staticMethod.getName()}${typeArguments}(${args})`;

                        return {
                            sourceFile,
                            callExpression,
                            text,
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