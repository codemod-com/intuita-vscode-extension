import {concatMutabilities, Mutability} from "./mutability";
import {CallableMetadata} from "../astCommandBuilders/splitClassAstCommandBuilders";

export type Group = Readonly<{
    methodNames: ReadonlyArray<string>;
    propertyNames: ReadonlyArray<string>;
    mutability: Mutability;
}>;

export const uniquify = <A>(
    array: ReadonlyArray<A>
): ReadonlyArray<A> => {
    return Array.from(new Set<A>(array)).sort();
};

export const repackageGroupMap = (
    oldGroupMap: ReadonlyMap<number, Group>
): ReadonlyMap<number, Group> => {
    const newGroupMap = new Map<number, Group>();

    const otherGroup = [...oldGroupMap.entries()]
        .filter(([index, ]) => index !== 0)
        .map(([_, group]) => {
            return group;
        })
        .reduce(
            (leftGroup, rightGroup) => {
                return {
                    methodNames: [
                        ...leftGroup.methodNames,
                        ...rightGroup.methodNames,
                    ],
                    propertyNames: [
                        ...leftGroup.propertyNames,
                        ...rightGroup.propertyNames,
                    ],
                    mutability: concatMutabilities(
                        [
                            leftGroup.mutability,
                            rightGroup.mutability,
                        ]
                    )
                };
            },
        );

    {
        const group = oldGroupMap.get(0);

        if (group) {
            newGroupMap.set(0, group);
        }

        newGroupMap.set(1, otherGroup);
    }

    return newGroupMap;
};

export const getGroupMap = (
    callableMetadataMap: ReadonlyMap<string, CallableMetadata>,
    maxGroupCount: 2 | null,
): ReadonlyMap<number, Group>=> {
    let groupNumber = 0;
    const groupMap = new Map<number, Group>;
    const traversedMethodNames = new Set<string>();

    const methodNames = Array.from(callableMetadataMap.keys()).sort();

    if (methodNames.length === 0) {
        return groupMap;
    }

    const traverse = (methodName: string) => {
        if(traversedMethodNames.has(methodName)) {
            return;
        }

        traversedMethodNames.add(methodName);

        const method = callableMetadataMap.get(methodName);

        if (!method || method.empty) {
            return;
        }

        const methodResult = [...callableMetadataMap.entries()].filter(
            ([_, method]) => method.callableNames.includes(methodName)
        );

        const groupResult = [...groupMap.entries()].find(
            ([_, group]) => group.methodNames.includes(methodName)
        );

        const methodNames = uniquify([
            ...(groupResult?.[1].methodNames ?? []),
            ...methodResult.map((r) => r[0]),
            methodName
        ]);

        const propertyNames = uniquify([
            ...(groupResult?.[1].propertyNames ?? []),
            ...methodResult.flatMap((r) => r[1].nonCallableNames),
            ...method.nonCallableNames,
        ]);

        const mutability = concatMutabilities([
            ...methodResult.flatMap((r) => r[1].mutability),
            method.mutability,
            groupResult?.[1].mutability ?? Mutability.READING_READONLY,
        ]);

        const group: Group = {
            methodNames,
            propertyNames,
            mutability,
        };

        if (!groupResult) {
            groupMap.set(
                groupNumber,
                group,
            );

            ++groupNumber;
        } else {
            groupMap.set(
                groupResult[0],
                group,
            );
        }

        methodResult.forEach(
            ([methodName,]) => {
                traverse(methodName);
            }
        );

    };

    for(let i = 0; i < methodNames.length; ++i) {
        methodNames.forEach(
            (methodName) => {
                const method = callableMetadataMap.get(methodName);

                if (!method) {
                    return;
                }

                const { callableNames } = method;

                if (callableNames.length === i) {
                    traverse(methodName);
                }
            }
        );
    }

    if (maxGroupCount === null || groupMap.size < 3) {
        return groupMap;
    }

    return repackageGroupMap(groupMap);
};