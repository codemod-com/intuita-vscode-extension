import {CallableFact, NonCallableFact} from "../factGetters/splitClassFacts";

export const buildSplitClassAstCommands = (
    nonCallableFactMap: ReadonlyMap<string, NonCallableFact>,
    callableFactMap: ReadonlyMap<string, CallableFact>,
) => {
    const oldCallableFacts = Array.from(callableFactMap.values());

    const newCallableFacts = oldCallableFacts.map(
        (callableFact) => {
            const callableName = callableFact.fact.name;

            const calleeNames: ReadonlyArray<string> = oldCallableFacts
                .filter(({ fact }) => fact.callerNames.includes(callableName))
                .map(({ fact }) => fact.name);

            return {
                ...callableFact,
                calleeNames,
            };
        }
    );

    
};