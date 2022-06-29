import {
    ClassDeclaration, ExpressionStatement,
    GetAccessorDeclaration,
    MethodDeclaration,
    Node,
    SetAccessorDeclaration,
    StructureKind,
    ts
} from "ts-morph";
import {isNeitherNullNorUndefined} from "../utilities";
import {
    Accessor,
    ClassInstanceProperty,
    ClassInstancePropertyKind, MethodExpression,
    MethodExpressionKind
} from "../intuitaExtension/classInstanceProperty";
import {uniquify} from "../intuitaExtension/getGroupMap";

export const getClassInstanceProperties = (
    classDefinition: ClassDeclaration
): ReadonlyArray<ClassInstanceProperty> => {
    const filterCallback = <T extends MethodDeclaration | SetAccessorDeclaration | GetAccessorDeclaration | ExpressionStatement>(
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
                const decorators = instanceProperty
                    .getDecorators()
                    .map(decorator => decorator.getStructure());

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

                // new:
                const constructorExpressions: MethodExpression[] = referencedSymbolEntries
                    .map(
                        (referencedSymbolEntry) => {
                            return referencedSymbolEntry
                                .getNode()
                                .getFirstAncestorByKind(ts.SyntaxKind.ExpressionStatement);
                        }
                    )
                    .filter(isNeitherNullNorUndefined)
                    .filter((expressionStatement) => {
                        return expressionStatement
                            .getFirstAncestorByKind(ts.SyntaxKind.Constructor) !== undefined;
                    })
                    .filter(filterCallback)
                    .map((expressionStatement) => {
                        const dependencyNames = expressionStatement
                            .getDescendantsOfKind(ts.SyntaxKind.Identifier)
                            .map(identifier => identifier.getText());

                        const expression = expressionStatement.getExpression();
                        const text = expressionStatement.getText();

                        if (Node.isBinaryExpression(expression)) {
                            const leftExpression = expression.getLeft();

                            if (Node.isPropertyAccessExpression(leftExpression)) {
                                const name = leftExpression.getName();

                                return {
                                    kind: MethodExpressionKind.PROPERTY_ASSIGNMENT,
                                    name,
                                    text,
                                    dependencyNames: dependencyNames
                                        .filter(dependencyName => dependencyName !== name),
                                };
                            }
                        }

                        return {
                            kind: MethodExpressionKind.OTHER,
                            text,
                            dependencyNames,
                        };
                    });

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
                    .filter(name => name !== instanceProperty.getName());

                const getAccessorNames = referencedSymbolEntries
                    .map(
                        (referencedSymbolEntry) => {
                            return referencedSymbolEntry
                                .getNode()
                                .getFirstAncestorByKind(ts.SyntaxKind.GetAccessor);
                        }
                    )
                    .filter(isNeitherNullNorUndefined)
                    .filter(filterCallback)
                    .map((declaration) => declaration.getName())
                    .filter(name => name !== instanceProperty.getName());

                const scope = instanceProperty.getScope() ?? null;

                if (Node.isParameterDeclaration(instanceProperty) || Node.isPropertyDeclaration(instanceProperty)) {
                    const readonly = Boolean(
                        instanceProperty.getCombinedModifierFlags() & ts.ModifierFlags.Readonly
                    );

                    const structure = instanceProperty.getStructure();

                    const initializer =
                        structure.kind === StructureKind.Property
                            ? structure.initializer?.toString() ?? null
                            : null;

                    const type = typeof structure.type === 'string'
                        ? structure.type
                        : null;

                    return {
                        kind: ClassInstancePropertyKind.PROPERTY, // TODO deal with the parameter kind
                        name: propertyName,
                        readonly,
                        initializer,
                        methodNames,
                        setAccessorNames,
                        getAccessorNames,
                        scope,
                        type,
                        constructorExpressions,
                        decorators,
                    };
                }

                if (Node.isGetAccessorDeclaration(instanceProperty)) {
                    const bodyText = instanceProperty.getBodyText() ?? null;
                    const returnType = instanceProperty.getReturnTypeNode()?.getText() ?? null;

                    return {
                        kind: ClassInstancePropertyKind.GET_ACCESSOR,
                        name: propertyName,
                        bodyText,
                        methodNames,
                        setAccessorNames,
                        getAccessorNames,
                        scope,
                        returnType,
                        decorators,
                    };
                }

                if (Node.isSetAccessorDeclaration(instanceProperty)) {
                    const bodyText = instanceProperty.getBodyText() ?? null;

                    const parameters = instanceProperty
                        .getParameters()
                        .map((parameter) => parameter.getStructure());

                    return {
                        kind: ClassInstancePropertyKind.SET_ACCESSOR,
                        name: propertyName,
                        bodyText,
                        methodNames,
                        setAccessorNames,
                        getAccessorNames,
                        parameters,
                        scope,
                        decorators,
                    };
                }

                return null;
            }
        )
        .filter(isNeitherNullNorUndefined);
};

export const getAccessors = (
    properties: ReadonlyArray<ClassInstanceProperty>
): ReadonlyMap<string, Accessor> => {
    const accessorMap = new Map<string, Accessor>;

    properties.forEach(
        (property) => {
            const { name } = property;

            if (property.kind === ClassInstancePropertyKind.GET_ACCESSOR) {
                const oldAccessor = accessorMap.get(name);

                const callerNames = uniquify([
                    ...(oldAccessor?.callerNames ?? []),
                    ...property.methodNames,
                    ...property.setAccessorNames,
                    ...property.getAccessorNames,
                ]);

                const getAccessor: NonNullable<Accessor['getAccessor']> = {
                    bodyText: property.bodyText,
                    scope: property.scope,
                    decorators: property.decorators,
                    returnType: property.returnType,
                };

                const newAccessor: Accessor = {
                    name,
                    getAccessor,
                    setAccessor: oldAccessor?.setAccessor ?? null,
                    callerNames,
                };

                accessorMap.set(
                    property.name,
                    newAccessor,
                );

                return;
            }

            if (property.kind === ClassInstancePropertyKind.SET_ACCESSOR) {
                const oldAccessor = accessorMap.get(name);

                const callerNames = uniquify([
                    ...(oldAccessor?.callerNames ?? []),
                    ...property.methodNames,
                    ...property.setAccessorNames,
                    ...property.getAccessorNames,
                ]);

                const setAccessor: NonNullable<Accessor['setAccessor']> = {
                    bodyText: property.bodyText,
                    scope: property.scope,
                    decorators: property.decorators,
                    parameters: property.parameters,
                };

                const newAccessor: Accessor = {
                    name,
                    getAccessor: oldAccessor?.getAccessor ?? null,
                    setAccessor,
                    callerNames,
                };

                accessorMap.set(
                    name,
                    newAccessor,
                );

                return;
            }
        }
    );

    return accessorMap;
};