import { Mutability} from "../intuitaExtension/mutability";

export type CallableMetadata = Readonly<{
    nonCallableNames: ReadonlyArray<string>,
    callableNames: ReadonlyArray<string>,
    mutability: Mutability,
    empty: boolean,
}>;
