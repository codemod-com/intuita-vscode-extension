import { Configuration } from "../../configuration";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact, MoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {
    calculateCharacterIndex,
    calculatePosition, IntuitaCharacterRange,
    IntuitaPosition,
    IntuitaRange,
    isNeitherNullNorUndefined
} from "../../utilities";
import {executeMoveTopLevelNodeAstCommandHelper} from "./4_astCommandExecutor";

// probably this will change to a different name (like solution?)
export type IntuitaDiagnostic = Readonly<{
    title: string,
    range: IntuitaRange,
}>;

export type IntuitaCodeAction = Readonly<{
    title: string,
    characterDifference: number,
    oldIndex: number,
    newIndex: number,
}>;

export class ExtensionStateManager {
    protected _state: Readonly<{
        fileName: string,
        diagnostics: ReadonlyArray<IntuitaDiagnostic>,
        fact: MoveTopLevelNodeFact,
    }> | null = null;

    public constructor(
        protected readonly _configuration: Configuration,
        protected readonly _setDiagnosticEntry: (
            fileName: string,
            diagnostics: ReadonlyArray<IntuitaDiagnostic>,
        ) => void,
    ) {

    }

    public onFileTextChanged(
        fileName: string,
        fileText: string,
        ranges: ReadonlyArray<IntuitaRange>,
    ) {
        const userCommand: MoveTopLevelNodeUserCommand = {
            kind: 'MOVE_TOP_LEVEL_NODE',
            fileName,
            fileText,
            options: this._configuration,
            ranges,
        };

        const fact = buildMoveTopLevelNodeFact(userCommand);

        const diagnostics = fact.solutions.map(
            (solutions) => {
                const solution = solutions[0]!;

                const { oldIndex } = solution;

                const topLevelNode = fact.topLevelNodes[oldIndex]!;

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

                return {
                    range,
                    title,
                    fact,
                };
            }
        );

        this._state = {
            fileName,
            fact,
            diagnostics,
        };

        this._setDiagnosticEntry(
            fileName,
            diagnostics,
        );
    }

    public findCodeActions(
        fileName: string,
        position: IntuitaPosition,
    ): ReadonlyArray<IntuitaCodeAction> {
        if (this._state?.fileName !== fileName) {
            return [];
        }

        const { fact } = this._state;

        return this
            ._state
            .diagnostics
            .filter(
                ({ range }) => {
                    return range[0] <= position[0]
                        && range[2] >= position[0]
                        && range[1] <= position[1]
                        && range[3] >= position[1];
                },
            )
            .map(
                ({ title }) => {
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

                    const characterDifference = characterIndex - topLevelNode.triviaStart;

                    const {
                        oldIndex,
                        newIndex,
                    } = solution;

                    return {
                        title,
                        characterDifference,
                        oldIndex,
                        newIndex,
                    };
                }
            )
            .filter(isNeitherNullNorUndefined);
    }

    public executeCommand(
        fileName: string,
        fileText: string,
        oldIndex: number,
        newIndex: number,
        characterDifference: number,
    ) {
        if (this._state?.fileName !== fileName) {
            return;
        }

        const {
            stringNodes,
        } = this._state.fact;

        const executions = executeMoveTopLevelNodeAstCommandHelper(
            fileName,
            oldIndex,
            newIndex,
            characterDifference,
            stringNodes,
        );

        const execution = executions[0] ?? null;

        if (!execution) {
            return null;
        }

        const { name, text, line, character } = execution;

        if (name !== fileName) {
            return null;
        }

        const oldLines = fileText.split('\n');
        const oldTextLastLineNumber = oldLines.length - 1;
        const oldTextLastCharacter = oldLines[oldLines.length - 1]?.length ?? 0;

        const range: IntuitaRange = [
            0,
            0,
            oldTextLastLineNumber,
            oldTextLastCharacter,
        ];

        const position: IntuitaPosition = [
            line,
            character,
        ];

        return {
            range,
            text,
            position,
        };
    }
}