import {CallableFact, NonCallableFact} from "../factGetters/splitClassFacts";
import {concatMutabilities, Mutability} from "../intuitaExtension/mutability";

type CallableMetadata = Readonly<{
    nonCallableNames: ReadonlyArray<string>,
    callableNames: ReadonlyArray<string>,
    mutability: Mutability,
}>;

export const buildSplitClassAstCommands = (
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

    const methodMap = new Map<string, CallableMetadata>(
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
        (property) => {
            property.fact.callerNames.forEach(
                (methodName) => {
                    const method = methodMap.get(methodName);

                    if (!method) {
                        return;
                    }

                    const propertyNames = method
                        .nonCallableNames
                        .slice()
                        .concat([ property.fact.name ]);

                    const mutability = concatMutabilities(
                        [
                            property.fact.readonly
                                ? Mutability.READING_READONLY
                                : Mutability.WRITING_WRITABLE,
                            method.mutability,
                        ],
                    );

                    methodMap.set(
                        methodName,
                        {
                            nonCallableNames: propertyNames,
                            callableNames: method.callableNames,
                            mutability,
                        },
                    );
                }
            );
        }
    );

    return methodMap;
};