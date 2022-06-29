export type PropertyFact = Readonly<{
    name: string,
    readonly: boolean,
    callerNames: ReadonlyArray<string>,
}>;

export type ParameterFact = Readonly<{
    name: string,
    readonly: boolean,
    callerNames: ReadonlyArray<string>,
}>;

export enum NonCallableKind {
    PROPERTY = 1,
    PARAMETER = 2,
}

export type NonCallableFact =
    | Readonly<{
        kind: NonCallableKind.PROPERTY,
        fact: PropertyFact,
    }>
    | Readonly<{
        kind: NonCallableKind.PARAMETER,
        fact: ParameterFact,
    }>;

export type MethodFact = Readonly<{
    name: string,
    callerNames: ReadonlyArray<string>,
    empty: boolean,
}>;

export type AccessorFact = Readonly<{
    name: string,
    setAccessorExists: boolean,
    getAccessorExists: boolean,
    callerNames: ReadonlyArray<string>,
    empty: boolean,
}>;

export enum CallableFactKind {
    METHOD_FACT = 1,
    ACCESSOR_FACT = 2,
}

export type CallableFact =
    | Readonly<{
    kind: CallableFactKind.METHOD_FACT,
    fact: MethodFact,
}>
    | Readonly<{
    kind: CallableFactKind.ACCESSOR_FACT,
    fact: AccessorFact,
}>;