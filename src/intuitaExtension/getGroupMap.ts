import {Method} from "./getMethodMap";
import {concatMutabilities, Mutability} from "./mutability";

type Group = Readonly<{
    methodNames: ReadonlyArray<string>;
    propertyNames: ReadonlyArray<string>;
    mutability: Mutability;
}>;

const uniquify = <A>(
    array: ReadonlyArray<A>
): ReadonlyArray<A> => {
    return Array.from(new Set<A>(array)).sort();
}

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
        if(traversedMethodNames.has(methodName)) {
            return;
        }

        traversedMethodNames.add(methodName);

        const method = methodMap.get(methodName);

        if (!method) {
            return;
        }

        const methodResult = [...methodMap.entries()].filter(
            ([_, method]) => method.methodNames.includes(methodName)
        );

        const groupResult = [...groupMap.entries()].find(
            ([_, group]) => group.methodNames.includes(methodName)
        );

        if (!groupResult) {
            groupMap.set(
                groupNumber,
                {
                    methodNames: uniquify([
                        ...methodResult.map((r) => r[0]),
                        methodName
                    ]),
                    propertyNames: method.propertyNames,
                    mutability: method.propertyMutability,
                }
            );

            ++groupNumber;
        } else {
            groupMap.set(
                groupResult[0],
                {
                    methodNames: uniquify([
                        ...methodResult.map((r) => r[0]),
                        ...groupResult[1].methodNames,
                        methodName
                    ]),
                    propertyNames: method.propertyNames,
                    mutability: method.propertyMutability,
                }
            );
        }

        methodResult.forEach(
            ([methodName,]) => {
                traverse(methodName);
            }
        );

    };

    methodNames.forEach(
        (methodName) => {
            const method = methodMap.get(methodName);

            if (!method) {
                return;
            }

            const { methodNames } = method;

            if (methodNames.length === 0) {
                traverse(methodName);
            }
        }
    );

    return groupMap;
}