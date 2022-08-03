import { Configuration } from "../../configuration";
import {MoveTopLevelNodeUserCommand, RangeCriterion} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact, MoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {
    buildHash,
    calculateCharacterIndex,
    calculatePosition,
    IntuitaPosition,
    IntuitaRange,
    isNeitherNullNorUndefined
} from "../../utilities";
import {executeMoveTopLevelNodeAstCommandHelper} from "./4_astCommandExecutor";
import * as vscode from "vscode";

// probably this will change to a different name (like solution?)
export type IntuitaDiagnostic = Readonly<{
    title: string,
    range: IntuitaRange,
    oldIndex: number,
    newIndex: number,
}>;

export type IntuitaCodeAction = Readonly<{
    title: string,
    characterDifference: number,
    oldIndex: number,
    newIndex: number,
}>;

type State = Map<
    string,
    Readonly<{
        document: vscode.TextDocument,
        diagnostics: ReadonlyArray<IntuitaDiagnostic>,
        fact: MoveTopLevelNodeFact,
    }>
>;

export class ExtensionStateManager {
    protected _state: State = new Map();

    public constructor(
        protected readonly _configuration: Configuration,
        protected readonly _setDiagnosticEntry: (
            fileName: string,
            diagnostics: ReadonlyArray<IntuitaDiagnostic>,
        ) => void,
    ) {

    }

    public getDocuments() {
        return Array.from(this._state.values());
    }

    public onFileTextChanged(
        document: vscode.TextDocument,
        rangeCriterion: RangeCriterion,
    ) {
        const { fileName } = document;
        const fileText = document.getText();

        const userCommand: MoveTopLevelNodeUserCommand = {
            kind: 'MOVE_TOP_LEVEL_NODE',
            fileName,
            fileText,
            options: this._configuration,
            rangeCriterion,
        };

        const fact = buildMoveTopLevelNodeFact(userCommand);

        const diagnostics = fact.solutions.map(
            (solutions) => {
                const solution = solutions[0]!;

                const { oldIndex, newIndex } = solution;

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
                    oldIndex,
                    newIndex,
                };
            }
        );

        const hash = buildHash(fileName);

        this._state.set(
            hash,
            {
                document,
                fact,
                diagnostics,
            },
        );

        this._setDiagnosticEntry(
            fileName,
            diagnostics,
        );
    }

    public findCodeActions(
        fileName: string,
        position: IntuitaPosition,
    ): ReadonlyArray<IntuitaCodeAction> {
        const fileData = this._state.get(
            buildHash(fileName),
        );

        if (!fileData) {
            return [];
        }

        const { fact } = fileData;

        return fileData
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
                        .solutions
                        .map((solutions) => solutions[0])
                        .filter(isNeitherNullNorUndefined)
                        .filter(
                            (solution) => {
                                return solution.oldIndex === topLevelNodeIndex;
                            }
                        );

                    const solution = solutions[0] ?? null;

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

    public getText(
        fileName: string,
        oldIndex: number,
        newIndex: number,
    ): string {
        const data = this._getExecution(
            fileName,
            oldIndex,
            newIndex,
            0,
        );

        return data?.execution.text ?? '';
    }

    public executeCommand(
        fileName: string,
        oldIndex: number,
        newIndex: number,
        characterDifference: number,
    ) {
        const data = this._getExecution(
            fileName,
            oldIndex,
            newIndex,
            characterDifference,
        );

        if (!data) {
            return null;
        }

        const {
            execution,
            fileText,
        } = data;

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

    protected _getExecution(
        fileName: string,
        oldIndex: number,
        newIndex: number,
        characterDifference: number,
    ) {
        const fileData = this._state.get(
            buildHash(fileName),
        );

        if (!fileData) {
            return null;
        }

        const fileText = fileData.document.getText();

        const {
            stringNodes,
        } = fileData.fact;

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

        return {
            execution,
            fileText,
        }
    }
}