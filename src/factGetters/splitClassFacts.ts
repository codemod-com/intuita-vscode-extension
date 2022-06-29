import {InstanceMethod} from "../tsMorphAdapter/getClassInstanceMethods";

export type PropertyFact = Readonly<{
    name: string,
    readonly: boolean,
    calleeNames: ReadonlyArray<string>,
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