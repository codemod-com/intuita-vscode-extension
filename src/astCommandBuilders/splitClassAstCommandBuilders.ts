import {CallableFact, NonCallableFact} from "../factGetters/splitClassFacts";
import {concatMutabilities, Mutability} from "../intuitaExtension/mutability";

type CallableMetadata = Readonly<{
    nonCallableNames: ReadonlyArray<string>,
    callableNames: ReadonlyArray<string>,
    mutability: Mutability,
}>;

export const buildCallableMetadataMap = (
    nonCallableFactMap: ReadonlyMap<string, NonCallableFact>,
    callableFactMap: ReadonlyMap<string, CallableFact>,
) => {
    const oldCallableFacts = Array.from(callableFactMap.values());

    const newCallableFacts = oldCallableFacts.map(
        (callableFact) => {
            const callableName = callableFact.fact.name;

            const callableNames: ReadonlyArray<string> = oldCallableFacts
                .filter(({ fact }) => fact.callerNames.includes(callableName))
                .map(({ fact }) => fact.name);

            return {
                ...callableFact,
                callableNames,
            };
        }
    );

    const callableMetadataMap = new Map<string, CallableMetadata>(
        newCallableFacts.map(({ fact, callableNames }) => ([
            fact.name,
            <CallableMetadata>{
                nonCallableNames: [],
                callableNames,
                mutability: Mutability.READING_READONLY,
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