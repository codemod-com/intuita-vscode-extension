import {InstanceMethod} from "../tsMorphAdapter/getClassInstanceMethods";

export type PropertyFact = Readonly<{
    name: string,
    readonly: boolean,
    calleeNames: ReadonlyArray<string>,
}>;

export type ParameterFact = Readonly<{
    name: string,
    readonly: boolean,
    calleeNames: ReadonlyArray<string>,
}>;

export enum NonCallableKind {
    PROPERTY = 1,
    PARAMETER = 2,
}

export type NonCallableFact =
    | Readonly<{
        kind: NonCallableKind.PROPERTY,
        property: PropertyFact,
    }>
    | Readonly<{
        kind: NonCallableKind.PARAMETER,
        parameter: ParameterFact,
    }>;

export type AccessorFact = Readonly<{
    name: string,
    setAccessorExists: boolean,
    getAccessorExists: boolean,
    callerNames: ReadonlyArray<string>,
}>;

export enum CallableKind {
    METHOD = 1,
    ACCESSOR = 2,
}

export type CallableFact =
    | Readonly<{
    kind: CallableKind.METHOD,
    method: InstanceMethod,
}>
    | Readonly<{
    kind: CallableKind.ACCESSOR,
    accessor: AccessorFact,
}>;