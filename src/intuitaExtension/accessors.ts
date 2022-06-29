import {DecoratorStructure, ParameterDeclarationStructure, Scope} from "ts-morph";

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