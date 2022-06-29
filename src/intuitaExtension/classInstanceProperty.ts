import {DecoratorStructure, ParameterDeclarationStructure, Scope} from "ts-morph";

export const enum ClassInstancePropertyKind {
    PARAMETER = 1, // defined in the constructor
    PROPERTY = 2, // defined in the body
    GET_ACCESSOR = 3,
    SET_ACCESSOR = 4,
}

export const enum MethodExpressionKind {
    PROPERTY_ASSIGNMENT = 1,
    OTHER = 2,
}

export type MethodExpression =
    | Readonly<{
        kind: MethodExpressionKind.PROPERTY_ASSIGNMENT,
        name: string,
        dependencyNames: ReadonlyArray<string>,
        text: string,
    }>
    | Readonly<{
        kind: MethodExpressionKind.OTHER,
        dependencyNames: ReadonlyArray<string>,
        text: string,
    }>;

export type ClassInstanceProperty =
    | Readonly<{
        kind: ClassInstancePropertyKind.PROPERTY,
        name: string,
        initializer: string | null,
        readonly: boolean,
        methodNames: ReadonlyArray<string>,
        setAccessorNames: ReadonlyArray<string>,
        getAccessorNames: ReadonlyArray<string>,
        scope: Scope | null,
        type: string | null,
        constructorExpressions: ReadonlyArray<MethodExpression>,
        decorators: ReadonlyArray<DecoratorStructure>,
    }>
    | Readonly<{
        kind: ClassInstancePropertyKind.GET_ACCESSOR,
        name: string,
        bodyText: string | null,
        methodNames: ReadonlyArray<string>,
        setAccessorNames: ReadonlyArray<string>,
        getAccessorNames: ReadonlyArray<string>,
        scope: Scope | null,
        returnType: string | null,
        decorators: ReadonlyArray<DecoratorStructure>,
    }>
    | Readonly<{
        kind: ClassInstancePropertyKind.SET_ACCESSOR,
        name: string,
        bodyText: string | null,
        methodNames: ReadonlyArray<string>,
        setAccessorNames: ReadonlyArray<string>,
        getAccessorNames: ReadonlyArray<string>,
        parameters: ReadonlyArray<ParameterDeclarationStructure>,
        scope: Scope | null,
        decorators: ReadonlyArray<DecoratorStructure>,
    }>
;

export type Accessor = Readonly<{
    name: string,
    setAccessor: Readonly<{
        bodyText: string | null,
        scope: Scope | null,
        decorators: ReadonlyArray<DecoratorStructure>,
        parameters: ReadonlyArray<ParameterDeclarationStructure>,
    }> | null,
    getAccessor: Readonly<{
        bodyText: string | null,
        scope: Scope | null,
        decorators: ReadonlyArray<DecoratorStructure>,
        returnType: string | null,
    }> | null,
    callerNames: ReadonlyArray<string>,
}>;
