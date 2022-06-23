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
    let groupNumber = 0;
    const groupMap = new Map<number, Group>;
    const traversedMethodNames = new Set<string>();

    const methodNames = Array.from(methodMap.keys()).sort()

    methodNames.forEach(
        (methodName) => {
            const method = methodMap.get(methodName);

            if (!method) {
                return;
            }

            const { methodNames } = method;

            if (methodNames.length === 0) {
                traversedMethodNames.add(methodName);

                groupMap.set(
                    groupNumber,
                    {
                        methodNames: [ methodName ],
                        propertyNames: method.propertyNames,
                        mutability: method.propertyMutability,
                    }
                );

                ++groupNumber;
            }
        }
    );

    return groupMap;
}