import {MoveTopLevelNodeUserCommand} from "../1_userCommandBuilder";
import {TopLevelNode} from "./topLevelNode";
import { calculateSolutions, Solution } from "./solutions";
import { getStringNodes, StringNode } from "./stringNodes";
import { buildTopLevelNodes } from "./buildTopLevelNodes";
import {calculateIndex, calculateLengths, calculateLines} from "../../../utilities";

export type MoveTopLevelNodeFact = Readonly<{
    topLevelNodes: ReadonlyArray<TopLevelNode>,
    selectedIndex: number,
    selectedTopLevelNodeIndex: number,
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
    const selectedIndex = calculateIndex(separator, lengths, fileLine, fileCharacter);

    const topLevelNodes = buildTopLevelNodes(
        fileName,
        fileText,
    );

    const selectedTopLevelNodeIndex = topLevelNodes
        .findIndex(node => node.start <= selectedIndex && selectedIndex <= node.end );

    const stringNodes = getStringNodes(fileText, topLevelNodes);

    const solutions = calculateSolutions(
        topLevelNodes,
        selectedTopLevelNodeIndex,
        options,
    );

    return {
        topLevelNodes,
        selectedIndex,
        selectedTopLevelNodeIndex,
        stringNodes,
        solutions,
    };
};