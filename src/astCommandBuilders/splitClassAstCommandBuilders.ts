import {CallableFact, CallableFactKind, NonCallableFact} from "../factGetters/splitClassFacts";
import {concatMutabilities, Mutability} from "../intuitaExtension/mutability";

type CallableMetadata = Readonly<{
    nonCallableNames: ReadonlyArray<string>,
    callableNames: ReadonlyArray<string>,
    mutability: Mutability,
}>;

export const buildCallableMetadataMap = (
    nonCallableFactMap: ReadonlyMap<string, NonCallableFact>,
    callableFactMap: ReadonlyMap<string, CallableFact>,
): ReadonlyMap<string, CallableMetadata> => {
    const oldCallableFacts = Array.from(callableFactMap.values());

    const newCallableFacts = oldCallableFacts.map(
        (callableFact) => {
            const callableName = callableFact.fact.name;

            const callableNames: ReadonlyArray<string> = oldCallableFacts
                .filter(({ fact }) => fact.callerNames.includes(callableName))
                .map(({ fact }) => fact.name);

            const mutability = callableFact.kind === CallableFactKind.ACCESSOR_FACT
                ? Mutability.WRITING_WRITABLE
                : Mutability.READING_READONLY;

            return {
                ...callableFact,
                callableNames,
                mutability
            };
        }
    );

    const callableMetadataMap = new Map<string, CallableMetadata>(
        newCallableFacts.map(({ fact, callableNames, mutability }) => ([
            fact.name,
            <CallableMetadata>{
                nonCallableNames: [],
                callableNames,
                mutability: concatMutabilities([
                    mutability,
                    ...newCallableFacts.map(({ mutability }) => mutability),
                ]),
            },
        ])),
    );

    nonCallableFactMap.forEach(
        (nonCallableFact) => {
            const { fact } =  nonCallableFact;

            fact.callerNames.forEach(
                (callableName) => {
                    const callableMetadata = callableMetadataMap.get(callableName);

                    if (!callableMetadata) {
                        return;
                    }

                    const nonCallableNames = callableMetadata
                        .nonCallableNames
                        .slice()
                        .concat([ fact.name ]);

                    const mutability = concatMutabilities(
                        [
                            nonCallableFact.fact.readonly
                                ? Mutability.READING_READONLY
                                : Mutability.WRITING_WRITABLE,
                            callableMetadata.mutability,
                        ],
                    );

                    callableMetadataMap.set(
                        callableName,
                        {
                            callableNames: callableMetadata.callableNames,
                            nonCallableNames,
                            mutability,
                        },
                    );
                }
            );
        }
    );

    return callableMetadataMap;
};