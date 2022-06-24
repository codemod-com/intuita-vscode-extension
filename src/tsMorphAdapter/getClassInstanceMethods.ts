import {
    ClassDeclaration,
    MethodDeclaration,
    ParameterDeclarationStructure,
    ts,
    TypeParameterDeclarationStructure
} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export type InstanceMethod = Readonly<{
    name: string,
    typeParameterDeclarations: ReadonlyArray<TypeParameterDeclarationStructure>,
    parameters: ReadonlyArray<ParameterDeclarationStructure>,
    returnType: string,
    calleeNames: ReadonlyArray<string>,
    bodyText: string | null,
    methodDeclaration: MethodDeclaration,
}>;

export const getClassInstanceMethods = (
    classDefinition: ClassDeclaration,
): ReadonlyArray<InstanceMethod> => {
    const oldMethods = classDefinition
        .getInstanceMethods()
        .map((methodDeclaration) => {
            const typeParameterDeclarations = methodDeclaration
                .getTypeParameters()
                .map((tpd) => tpd.getStructure());

            const parameters = methodDeclaration
                .getParameters()
                .map(parameter => parameter.getStructure());

            const returnType = methodDeclaration
                .getReturnTypeNode()
                ?.getText() ?? 'void';

            const bodyText = methodDeclaration.getBodyText() ?? null;

            const callerNames = methodDeclaration
                .findReferences()
                .flatMap((referencedSymbol) => referencedSymbol.getReferences())
                .map(
                    (referencedSymbolEntry) => {
                        return referencedSymbolEntry
                            .getNode()
                            .getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration);
                    }
                )
                .filter(isNeitherNullNorUndefined)
                .filter(
                    (otherMethodDeclaration) => {
                        if (otherMethodDeclaration === methodDeclaration) {
                            return false;
                        }

                        const methodClassDeclaration = otherMethodDeclaration
                            .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration);

                        return methodClassDeclaration === classDefinition;
                    }
                )
                .map((md) => md.getName());

            return {
                name: methodDeclaration.getName(),
                callerNames,
                typeParameterDeclarations,
                parameters,
                returnType,
                bodyText,
                methodDeclaration,
            };
        });

    // invert the relationship
    return oldMethods.map(
        (method) => {
            const calleeNames: ReadonlyArray<string> = oldMethods
                .filter(({ callerNames }) => callerNames.includes(method.name))
                .map(({ name }) => name);

            return {
                ...method,
                calleeNames,
            };
        }
    );
};