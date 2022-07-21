import { Configuration } from "../../configuration";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact, MoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {
    calculateCharacterIndex,
    calculatePosition,
    IntuitaPosition,
    IntuitaRange,
    isNeitherNullNorUndefined
} from "../../utilities";
import {executeMoveTopLevelNodeAstCommand} from "./4_astCommandExecutor";
import * as vscode from "vscode";

// probably this will change to a different name (like solution?)
export type IntuitaDiagnostic = Readonly<{
    title: string,
    range: IntuitaRange,
    fact: MoveTopLevelNodeFact,
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
    ) {
        const userCommand: MoveTopLevelNodeUserCommand = {
            kind: 'MOVE_TOP_LEVEL_NODE',
            fileName,
            fileText,
            options: this._configuration,
        };

        const fact = buildMoveTopLevelNodeFact(userCommand);

        const diagnostics = fact.solutions.map(
            (solutions, index) => {
                const topLevelNode = fact.topLevelNodes[index]!;

                const solution = solutions[0]!;

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
                ({ fact, title }) => {
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

    public async executeCommand(
        fileName: string,
        fileText: string,
        oldIndex: number,
        newIndex: number,
        characterDifference: number,
    ) {
        const executions = executeMoveTopLevelNodeAstCommand({
            kind: "MOVE_TOP_LEVEL_NODE",
            fileName,
            fileText,
            oldIndex,
            newIndex,
            characterDifference,
        });

        const execution = executions[0] ?? null;

        if (!execution) {
            return;
        }

        const { name, text, line, character } = execution;

        if (name !== fileName) {
            return;
        }

        const oldLines = fileText.split('\n');
        const oldTextLastLineNumber = oldLines.length - 1;
        const oldTextLastCharacter = oldLines[oldLines.length - 1]?.length ?? 0;

        const range = new vscode.Range(
            new vscode.Position(
                0,
                0
            ),
            new vscode.Position(
                oldTextLastLineNumber,
                oldTextLastCharacter
            ),
        );

        const activeTextEditor = vscode.window.activeTextEditor!;

        await activeTextEditor.edit(
            (textEditorEdit) => {
                textEditorEdit.replace(
                    range,
                    text,
                );
            }
        );

        const position = new vscode.Position(line, character);
        const selection = new vscode.Selection(position, position);

        activeTextEditor.selections = [ selection ];

        activeTextEditor.revealRange(
            new vscode.Range(position, position),
            vscode.TextEditorRevealType.AtTop,
        );
    }
}