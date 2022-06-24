import {ClassInstancePropertyTypes} from "ts-morph";

export type ClassInstanceProperty = Readonly<{
    name: string;
    initializer: string | null
    readonly: boolean;
    methodNames: ReadonlyArray<string>,
    instanceProperty: ClassInstancePropertyTypes,
}>;

