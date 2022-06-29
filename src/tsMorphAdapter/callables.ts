import { Accessor } from "../intuitaExtension/classInstanceProperty";
import { InstanceMethod } from "./getClassInstanceMethods";

export enum CallableKind {
    METHOD = 1,
    ACCESSOR = 2,
}

export type Callable =
    | Readonly<{
        kind: CallableKind.METHOD,
        method: InstanceMethod,
    }>
    | Readonly<{
        kind: CallableKind.ACCESSOR,
        accessor: Accessor,
    }>;
