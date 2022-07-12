import {MoveTopLevelNodeUserCommand} from "../1_userCommandBuilder";
import {TopLevelNode} from "./topLevelNode";
import { calculateSolutions, Solution } from "./solutions";
import { getStringNodes, StringNode } from "./stringNodes";
import { buildTopLevelNodes } from "./buildTopLevelNodes";
import {calculateCharacterIndex, calculateLengths, calculateLines} from "../../../utilities";

export type MoveTopLevelNodeFact = Readonly<{
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    selectedTopLevelNodeIndex: number,
    characterDifference: number,
    stringNodes: ReadonlyArray<StringNode>,
    solutions: ReadonlyArray<Solution>,
}>;

export const buildMoveTopLevelNodeFact = (
    userCommand: MoveTopLevelNodeUserCommand
): MoveTopLevelNodeFact => {
    const {
        fileName,
        fileText,
        fileLine,
        fileCharacter,
        options,
    } = userCommand;

    const separator = '\n';

    const lines = calculateLines(fileText, separator);
    const lengths = calculateLengths(lines);
    const characterIndex = calculateCharacterIndex(separator, lengths, fileLine, fileCharacter);

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const selectedTopLevelNodeIndex = topLevelNodes
        .findIndex(node => node.start <= characterIndex && characterIndex <= node.end );

    const characterDifference = (
        characterIndex - (topLevelNodes[selectedTopLevelNodeIndex]?.start ?? characterIndex)
    );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const solutions = calculateSolutions(
        topLevelNodes,
        selectedTopLevelNodeIndex,
        options,
    );

    return {
        topLevelNodes,
        selectedTopLevelNodeIndex,
        characterDifference,
        stringNodes,
        solutions,
    };
};