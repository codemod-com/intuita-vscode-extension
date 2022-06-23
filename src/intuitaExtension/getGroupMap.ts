import {Method} from "./getMethodMap";
import {concatMutabilities, Mutability} from "./mutability";

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

    if (methodNames.length === 0) {
        return groupMap;
    }

    const traverse = (methodName: string) => {

    }

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

    methodNames
        .filter(methodName => !traversedMethodNames.has(methodName))
        .forEach(
            (methodName) => {
                const method = methodMap.get(methodName);

                if (!method) {
                    return;
                }

                const { methodNames } = method;

                if (methodNames.length === 1) {
                    console.log(methodName, methodNames);

                    const result = [...groupMap.entries()].find(
                        ([_, group]) => group.methodNames.includes(methodName)
                    )

                    if (!result) {
                        return;
                    }

                    traversedMethodNames.add(methodName);

                    groupMap.set(
                        result[0],
                        {
                            methodNames: [ ...result[1].methodNames, methodName ],
                            propertyNames: [...result[1].propertyNames, ...method.propertyNames ],
                            mutability: concatMutabilities(
                                [
                                    result[1].mutability,
                                    method.propertyMutability,
                                ]
                            )
                        }
                    );
                }
            }
        )

    console.log(groupMap);

    return groupMap;
}