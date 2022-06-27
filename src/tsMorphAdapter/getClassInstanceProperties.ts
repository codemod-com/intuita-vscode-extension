import {ClassDeclaration, Node, StructureKind, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";
import {ClassInstanceProperty, ClassInstancePropertyKind} from "../intuitaExtension/classInstanceProperty";

export const getClassInstanceProperties = (
    classDefinition: ClassDeclaration
): ReadonlyArray<ClassInstanceProperty> => {
    return classDefinition
        .getInstanceProperties()
        .map<ClassInstanceProperty | null>(
            (instanceProperty) => {
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

                if (Node.isParameterDeclaration(instanceProperty) || Node.isPropertyDeclaration(instanceProperty)) {
                    console.log(instanceProperty.getKindName())

                    const name = instanceProperty.getName();
                    const readonly = Boolean(
                        instanceProperty.getCombinedModifierFlags() & ts.ModifierFlags.Readonly
                    );

                    const structure = instanceProperty.getStructure();

                    const initializer =
                        structure.kind === StructureKind.Property
                            ? structure.initializer?.toString() ?? null
                            : null;

                    return {
                        kind: ClassInstancePropertyKind.PROPERTY, // TODO deal with the parameter kind
                        name,
                        readonly,
                        initializer,
                        methodNames,
                    };
                }

                if (Node.isGetAccessorDeclaration(instanceProperty)) {
                    const name = instanceProperty.getName();
                    const bodyText = instanceProperty.getBodyText() ?? null;

                    return {
                        kind: ClassInstancePropertyKind.GETTER,
                        name,
                        bodyText,
                        methodNames,
                    };
                }

                if (Node.isSetAccessorDeclaration(instanceProperty)) {
                    const name = instanceProperty.getName();
                    const bodyText = instanceProperty.getBodyText() ?? null;

                    return {
                        kind: ClassInstancePropertyKind.SETTER,
                        name,
                        bodyText,
                        methodNames,
                    };
                }

                return null;
            }
        )
        .filter(isNeitherNullNorUndefined);
}