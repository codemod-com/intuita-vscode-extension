import {ClassDeclaration, MethodDeclaration, Node, SetAccessorDeclaration, StructureKind, ts} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";
import {ClassInstanceProperty, ClassInstancePropertyKind} from "../intuitaExtension/classInstanceProperty";

export const getClassInstanceProperties = (
    classDefinition: ClassDeclaration
): ReadonlyArray<ClassInstanceProperty> => {
    const filterCallback = <T extends MethodDeclaration | SetAccessorDeclaration>(
        declaration: T,
    ): boolean => {
        const otherClassDeclaration = declaration
            .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration);

        return otherClassDeclaration === classDefinition;
    };

    return classDefinition
        .getInstanceProperties()
        .map<ClassInstanceProperty | null>(
            (instanceProperty) => {
                const propertyName = instanceProperty.getName();

                const referencedSymbolEntries = instanceProperty
                    .findReferences()
                    .flatMap((referencedSymbol) => referencedSymbol.getReferences());

                const methodNames = referencedSymbolEntries
                    .map(
                        (referencedSymbolEntry) => {
                            return referencedSymbolEntry
                                .getNode()
                                .getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration);
                        }
                    )
                    .filter(isNeitherNullNorUndefined)
                    .filter(filterCallback)
                    .map((declaration) => declaration.getName());

                const setAccessorNames = referencedSymbolEntries
                    .map(
                        (referencedSymbolEntry) => {
                            return referencedSymbolEntry
                                .getNode()
                                .getFirstAncestorByKind(ts.SyntaxKind.SetAccessor);
                        }
                    )
                    .filter(isNeitherNullNorUndefined)
                    .filter(filterCallback)
                    .map((declaration) => declaration.getName())
                    .filter(name => name !== instanceProperty.getName())

                if (Node.isParameterDeclaration(instanceProperty) || Node.isPropertyDeclaration(instanceProperty)) {
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
                        name: propertyName,
                        readonly,
                        initializer,
                        methodNames,
                        setAccessorNames,
                    };
                }

                if (Node.isGetAccessorDeclaration(instanceProperty)) {
                    const bodyText = instanceProperty.getBodyText() ?? null;

                    return {
                        kind: ClassInstancePropertyKind.GETTER,
                        name: propertyName,
                        bodyText,
                        methodNames,
                        setAccessorNames,
                    };
                }

                if (Node.isSetAccessorDeclaration(instanceProperty)) {
                    const bodyText = instanceProperty.getBodyText() ?? null;

                    return {
                        kind: ClassInstancePropertyKind.SETTER,
                        name: propertyName,
                        bodyText,
                        methodNames,
                        setAccessorNames,
                    };
                }

                return null;
            }
        )
        .filter(isNeitherNullNorUndefined);
};