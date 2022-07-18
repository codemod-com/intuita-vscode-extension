import { Configuration } from "../../configuration";
import { calculateCharacterIndex } from "../../utilities";
import { buildMoveTopLevelNodeUserCommand } from "./1_userCommandBuilder";
import { buildMoveTopLevelNodeFact } from "./2_factBuilders";

export const buildFact = (
    fileName: string,
    fileText: string,
    position: Readonly<[number, number]>,
    configuration: Configuration,
) => {
    const userCommand = buildMoveTopLevelNodeUserCommand(
        fileName,
        fileText,
        configuration
    );

    const fact = buildMoveTopLevelNodeFact(userCommand);

    const characterIndex = calculateCharacterIndex(
        fact.separator,
        fact.lengths,
        position[0],
        position[1],
    );

    const topLevelNodeIndex = fact.topLevelNodes.findIndex(
        (topLevelNode) => {
            return topLevelNode.start <= characterIndex
                && characterIndex <= topLevelNode.end;
        }
    );

    const topLevelNode = fact.topLevelNodes[topLevelNodeIndex] ?? null;

    if (topLevelNodeIndex === -1 || topLevelNode === null) {
        return null;
    }

    const solutions = fact
        .solutions[topLevelNodeIndex]
        ?.filter(
            (solution) => {
                return solution.newIndex !== solution.oldIndex;
            }
        );

    const solution = solutions?.[0] ?? null;

    if (solution === null) {
        return null;
    }

    const characterDifference = characterIndex - topLevelNode.start;

    return {
        solution,
        characterDifference,
        topLevelNode,
        fact,
    };
};