import {ClassDeclaration, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";

export const getClassInstanceMethods = (
    classDefinition: ClassDeclaration,
): ReadonlyArray<[string, ReadonlyArray<string>]> => {
    const oldMethods: ReadonlyArray<[string, ReadonlyArray<string>]> = classDefinition
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
                        if (otherMethodDeclaration === methodDeclaration) {
                            return false;
                        }

                        const methodClassDeclaration = otherMethodDeclaration
                            .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration)

                        return methodClassDeclaration === classDefinition;
                    }
                )
                .map((md) => md.getName());

            return [
                methodDeclaration.getName(),
                methodNames,
            ];
        });

    // invert the relationship
    return oldMethods.map(
        ([methodName, _]) => {
            const methodNames: ReadonlyArray<string> = oldMethods
                .filter(([_, methodNames]) => methodNames.includes(methodName))
                .map(([mn, ]) => mn)

            return [
                methodName,
                methodNames,
            ];
        }
    );
};