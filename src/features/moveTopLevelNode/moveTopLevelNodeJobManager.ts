import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {MoveTopLevelNodeFact} from "./2_factBuilders";
import {
    assertsNeitherNullOrUndefined,
    calculateCharacterIndex,
    calculatePosition,
    IntuitaPosition,
    IntuitaRange,
    isNeitherNullNorUndefined
} from "../../utilities";
import {buildMoveTopLevelNodeJobHash, JobHash} from "./jobHash";
import {JobKind} from "../../jobs";
import {Solution} from "./2_factBuilders/solutions";

export type MoveTopLevelNodeJob = Readonly<{
    kind: JobKind.moveTopLevelNode,
    fileName: string,
    hash: JobHash,
    title: string,
    range: IntuitaRange,
    oldIndex: number,
    newIndex: number,
    score: [number, number],
}>;

const buildIdentifiersLabel = (
    identifiers: ReadonlyArray<string>,
    useHtml: boolean,
): string => {
    const label = identifiers.length > 1
        ? `(${identifiers.join(' ,')})`
        : identifiers.join('');

    if (!useHtml) {
        return label;
    }

    return `<b>${label}</b>`;
};
export const buildTitle = (
    solution: Solution,
    useHtml: boolean,
): string | null => {
    const {
        nodes,
        newIndex,
    } = solution;

    const node = nodes[newIndex];

    if (!node) {
        return null;
    }

    let nodeIdentifiersLabel = buildIdentifiersLabel(
        Array.from(
            node.identifiers
        ),
        useHtml,
    );

    const otherNode = newIndex === 0
        ? nodes[1]
        : nodes[newIndex - 1];

    if (!otherNode) {
        return null;
    }

    const orderLabel = newIndex === 0
        ? 'before'
        : 'after';

    const otherIdentifiersLabel = buildIdentifiersLabel(
        Array.from(
            otherNode.identifiers
        ),
        useHtml,
    );

    return `Move ${nodeIdentifiersLabel} ${orderLabel} ${otherIdentifiersLabel}`;
};

export const buildMoveTopLevelNodeJobs = (
    userCommand: MoveTopLevelNodeUserCommand,
    fact: MoveTopLevelNodeFact,
    rejectedJobHashes: ReadonlySet<JobHash>,
): ReadonlyArray<MoveTopLevelNodeJob> => {
    return fact.solutions.map<MoveTopLevelNodeJob | null>(
        (solution) => {
            const { oldIndex, newIndex } = solution;

            const topLevelNode = fact.topLevelNodes[oldIndex] ?? null;

            if (topLevelNode === null) {
                return null;
            }

            const title = buildTitle(solution, false) ?? '';

            const start = calculatePosition(
                fact.separator,
                fact.lengths,
                topLevelNode.nodeStart,
            );

            const range: IntuitaRange = [
                start[0],
                start[1],
                start[0],
                fact.lengths[start[0]] ?? start[1],
            ];

            const hash = buildMoveTopLevelNodeJobHash(
                userCommand.fileName,
                oldIndex,
                newIndex,
            );

            if (rejectedJobHashes.has(hash)) {
                return null;
            }

            return {
                kind: JobKind.moveTopLevelNode,
                fileName: userCommand.fileName,
                hash,
                range,
                title,
                oldIndex,
                newIndex,
                score: solution.score,
            };
        }
    )
        .filter(isNeitherNullNorUndefined);
};

export const calculateCharacterDifference = (
    fact: MoveTopLevelNodeFact,
    position: IntuitaPosition,
): number => {
    const characterIndex = calculateCharacterIndex(
        fact.separator,
        fact.lengths,
        position[0],
        position[1],
    );

    const topLevelNodeIndex = fact
        .topLevelNodes
        .findIndex(
            (topLevelNode) => {
                return topLevelNode.triviaStart <= characterIndex
                    && characterIndex <= topLevelNode.triviaEnd;
            }
        );

    const topLevelNode = fact.topLevelNodes[topLevelNodeIndex] ?? null;

    assertsNeitherNullOrUndefined(topLevelNode);

    return characterIndex - topLevelNode.triviaStart;
};
