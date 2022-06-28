import {ParameterDeclarationStructure, Scope} from "ts-morph";

export const enum ClassInstancePropertyKind {
    PARAMETER = 1, // defined in the constructor
    PROPERTY = 2, // defined in the body
    GETTER = 3,
    SETTER = 4,
}

export const enum MethodExpressionKind {
    PROPERTY_ASSIGNMENT = 1,
    OTHER = 2,
}

export type MethodExpression =
    | Readonly<{
        kind: MethodExpressionKind.PROPERTY_ASSIGNMENT,
        propertyName: string,
        rightSideText: string;
    }>
    | Readonly<{
        kind: MethodExpressionKind.OTHER,
        text: string,
        dependencyNames: ReadonlyArray<string>,
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
    }>
    | Readonly<{
        kind: ClassInstancePropertyKind.GETTER,
        name: string,
        bodyText: string | null,
        methodNames: ReadonlyArray<string>,
        setAccessorNames: ReadonlyArray<string>,
        getAccessorNames: ReadonlyArray<string>,
        scope: Scope | null,
        returnType: string | null,
    }>
    | Readonly<{
        kind: ClassInstancePropertyKind.SETTER,
        name: string,
        bodyText: string | null,
        methodNames: ReadonlyArray<string>,
        setAccessorNames: ReadonlyArray<string>,
        getAccessorNames: ReadonlyArray<string>,
        parameters: ReadonlyArray<ParameterDeclarationStructure>,
        scope: Scope | null,
    }>
;
