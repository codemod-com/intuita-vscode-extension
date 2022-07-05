import {concatMutabilities, Mutability} from "./mutability";
import {CallableMetadata} from "../astCommandBuilders/splitClassAstCommandBuilders";

export type Group = Readonly<{
    callableNames: ReadonlyArray<string>;
    nonCallableNames: ReadonlyArray<string>;
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
                    callableNames: [
                        ...leftGroup.callableNames,
                        ...rightGroup.callableNames,
                    ],
                    nonCallableNames: [
                        ...leftGroup.nonCallableNames,
                        ...rightGroup.nonCallableNames,
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

const getCallableIdentifiers = <CallableIdentifier extends string | ReadonlySet<string>>(
    callableIdentifier: CallableIdentifier,
): ReadonlyArray<string> => {
    return (typeof callableIdentifier === 'string')
        ? [ callableIdentifier ]
        : Array.from(callableIdentifier);
};

export const getGroupMap = <CallableIdentifier extends string | ReadonlySet<string>>(
    callableMetadataMap: ReadonlyMap<CallableIdentifier, CallableMetadata>,
    maxGroupCount: 2 | null,
): ReadonlyMap<number, Group>=> {
    let groupNumber = 0;
    const groupMap = new Map<number, Group>;
    const traversedMethodNames = new Set<CallableIdentifier>();

    const methodNames = Array.from(callableMetadataMap.keys()).sort();

    if (methodNames.length === 0) {
        return groupMap;
    }

    const traverse = (callableIdentifier: CallableIdentifier) => {
        if(traversedMethodNames.has(callableIdentifier)) {
            return;
        }

        traversedMethodNames.add(callableIdentifier);

        const method = callableMetadataMap.get(callableIdentifier);

        if (!method || method.empty) {
            return;
        }

        const callableIdentifiers = getCallableIdentifiers(callableIdentifier);

        const methodResult = [...callableMetadataMap.entries()].filter(
            ([_, method]) => {
                return callableIdentifiers
                    .every(name => method.callableNames.includes(name));
            }
        );

        const groupResult = [...groupMap.entries()].find(
            ([_, group]) => {
                return callableIdentifiers
                    .every(name => group.callableNames.includes(name));
            }
        );

        const methodNames = uniquify<string>([
            ...(groupResult?.[1].callableNames ?? []),
            ...methodResult.flatMap((r) => getCallableIdentifiers(r[0])),
            ...getCallableIdentifiers(callableIdentifier),
        ]);

        const propertyNames = uniquify([
            ...(groupResult?.[1].nonCallableNames ?? []),
            ...methodResult.flatMap((r) => r[1].nonCallableNames),
            ...method.nonCallableNames,
        ]);

        const mutability = concatMutabilities([
            ...methodResult.flatMap((r) => r[1].mutability),
            method.mutability,
            groupResult?.[1].mutability ?? Mutability.READING_READONLY,
        ]);

        const group: Group = {
            callableNames: methodNames,
            nonCallableNames: propertyNames,
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
            (callableIdentifier) => {
                const method = callableMetadataMap.get(callableIdentifier);

                if (!method) {
                    return;
                }

                const { callableNames } = method;

                if (callableNames.length === i) {
                    traverse(callableIdentifier);
                }
            }
        );
    }

    if (maxGroupCount === null || groupMap.size < 3) {
        return groupMap;
    }

    return repackageGroupMap(groupMap);
};