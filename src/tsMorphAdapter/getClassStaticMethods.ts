import {ClassDeclaration, MethodDeclaration, ParameterDeclarationStructure, ts, TypeParameterDeclarationStructure} from "ts-morph";

export type StaticMethod = Readonly<{
    name: string,
    typeParameterDeclarations: ReadonlyArray<TypeParameterDeclarationStructure>,
    parameters: ReadonlyArray<ParameterDeclarationStructure>,
    returnType: string,
    bodyText: string | null,
    staticMethod: MethodDeclaration,
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

                return {
                    name,
                    typeParameterDeclarations,
                    parameters,
                    returnType,
                    bodyText,
                    staticMethod,
                };

                // if(Node.isStatemented(classParentNode)) {
                //     lazyFunctions.push(
                //         () => {
                //             const functionDeclaration = classParentNode.insertFunction(
                //                 index,
                //                 {
                //                     name,
                //                 }
                //             );
                //
                //             functionDeclaration.setIsExported(true);
                //             functionDeclaration.addTypeParameters(typeParameterDeclarations);
                //             functionDeclaration.addParameters(parameters);
                //             functionDeclaration.setReturnType(returnType);
                //
                //             if (bodyText) {
                //                 functionDeclaration.setBodyText(bodyText);
                //             }
                //         }
                //     );
                // }

                // staticMethod
                //     .findReferences()
                //     .flatMap((referencedSymbol) => referencedSymbol.getReferences())
                //     .forEach((referencedSymbolEntry) => {
                //         const sourceFile = referencedSymbolEntry.getSourceFile();
                //
                //         this._changedSourceFiles.add(sourceFile);
                //
                //         const node = referencedSymbolEntry.getNode();
                //
                //         const callExpression = node
                //             .getFirstAncestorByKind(
                //                 ts.SyntaxKind.CallExpression
                //             );
                //
                //         if (!callExpression) {
                //             return;
                //         }
                //
                //         let typeArguments = callExpression
                //             .getTypeArguments()
                //             .map(ta => ta.getText())
                //             .join(', ');
                //
                //         typeArguments = typeArguments ? `<${typeArguments}>` : '';
                //
                //         const args = callExpression
                //             .getArguments()
                //             .map((arg) => arg.getText())
                //             .join(', ');
                //
                //         // TODO: maybe there's a programmatic way to do this?
                //         const text = `${staticMethod.getName()}${typeArguments}(${args})`;
                //
                //         lazyFunctions.push(
                //             () => callExpression.replaceWithText(text),
                //         );
                //
                //         newImportDeclarationMap.addItem(
                //             sourceFile,
                //             name,
                //         );
                //     });
                //
                // ++deletedMemberCount;
                //
                // lazyFunctions.push(
                //     () => staticMethod.remove(),
                // );
                //
                // this._changedSourceFiles.add(sourceFile);
            }
        );
};