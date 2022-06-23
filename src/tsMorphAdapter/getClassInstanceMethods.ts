import {ClassDeclaration, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export const getClassInstanceMethods = (
    classDefinition: ClassDeclaration,
): ReadonlyArray<[string, ReadonlyArray<string>]> => {
    return classDefinition
        .getInstanceMethods()
        .map((methodDeclaration) => {

            const methodNames = methodDeclaration
                .findReferences()
                .flatMap((referencedSymbol) => referencedSymbol.getReferences())
                .map(
                    (referencedSymbolEntry) => {
                        return referencedSymbolEntry
                            .getNode()
                            .getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration)
                    }
                )
                .filter(isNeitherNullNorUndefined)
                .filter(
                    (otherMethodDeclaration) => {
                        const methodClassDeclaration = otherMethodDeclaration
                            .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration)

                        return methodClassDeclaration !== classDefinition;
                    }
                )
                .map((md) => md.getName());

            return [
                methodDeclaration.getName(),
                methodNames,
            ];
        });
};