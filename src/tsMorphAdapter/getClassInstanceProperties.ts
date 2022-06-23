import {ClassDeclaration, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";
import {ClassInstanceProperty} from "../intuitaExtension/classInstanceProperty";

export const getClassInstanceProperties = (
    classDefinition: ClassDeclaration
): ReadonlyArray<ClassInstanceProperty> => {
    return classDefinition
        .getInstanceProperties()
        .map(
            (instanceProperty) => {
                const name = instanceProperty.getName();
                const readonly = Boolean(
                    instanceProperty.getCombinedModifierFlags() & ts.ModifierFlags.Readonly
                );

                const methodNames = instanceProperty
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
                    .map(
                        (methodDeclaration) => {
                            const methodName = methodDeclaration.getName();

                            const methodClassDeclaration = methodDeclaration
                                .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration)

                            if (methodClassDeclaration !== classDefinition) {
                                return null;
                            }

                            return methodName;
                        }
                    )
                    .filter(isNeitherNullNorUndefined)
                ;

                return {
                    name,
                    readonly,
                    methodNames,
                };
            }
        );
}