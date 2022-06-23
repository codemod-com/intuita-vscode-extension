import {Method} from "./getMethodMap";
import {Mutability} from "./mutability";

type Group = Readonly<{
    methodNames: ReadonlyArray<string>;
    propertyNames: ReadonlyArray<string>;
    mutability: Mutability;
}>;

export const getGroupMap = (
    methodMap: ReadonlyMap<string, Method>,
): ReadonlyMap<number, Group>=> {
    return new Map<number, Group>;
}