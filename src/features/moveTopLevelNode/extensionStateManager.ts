import { Configuration } from "../../configuration";
import {MoveTopLevelNodeUserCommand, RangeCriterion} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact, MoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {
    assertsNeitherNullOrUndefined,
    buildHash,
    calculateCharacterIndex,
    calculatePosition,
    IntuitaPosition,
    IntuitaRange,
    isNeitherNullNorUndefined
} from "../../utilities";
import {executeMoveTopLevelNodeAstCommandHelper} from "./4_astCommandExecutor";
import * as vscode from "vscode";
import {Container} from "../../container";
import { buildRecommendationHash, RecommendationHash } from "./recommendationHash";
import { buildFileNameHash, FileNameHash } from "./fileNameHash";

export type IntuitaRecommendation = Readonly<{
    hash: RecommendationHash,
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

export class ExtensionStateManager {
    protected _documentMap = new Map<FileNameHash, vscode.TextDocument>();
    protected _factMap = new Map<FileNameHash, MoveTopLevelNodeFact>();
    protected _recommendationHashMap = new Map<FileNameHash, Set<RecommendationHash>>();
    protected _rejectedRecommendationHashes = new Set<RecommendationHash>();
    protected _recommendationMap = new Map<RecommendationHash, IntuitaRecommendation>;

    public constructor(
        protected readonly _configurationContainer: Container<Configuration>,
        protected readonly _setDiagnosticEntry: (
            fileName: string,
            recommendations: ReadonlyArray<IntuitaRecommendation>,
        ) => void,
    ) {

    }

    // TODO: change name
    public getDocuments() {
        const fileNameHashes = Array.from(
            this._documentMap.keys()
        );

        return fileNameHashes.map(
            (fileNameHash) => {
                const document = this._documentMap.get(fileNameHash);
                const fact = this._factMap.get(fileNameHash);
                const recommendationHashes = this._recommendationHashMap.get(fileNameHash);

                assertsNeitherNullOrUndefined(document);
                assertsNeitherNullOrUndefined(fact);
                assertsNeitherNullOrUndefined(recommendationHashes);
                
                const recommendations = Array.from(recommendationHashes).map(
                    (recommendationHash) => {
                        if (this._rejectedRecommendationHashes.has(recommendationHash)) {
                            return null;
                        }

                        return this._recommendationMap.get(recommendationHash);
                    },
                )
                    .filter(isNeitherNullNorUndefined);

                return {
                    document,
                    fact,
                    recommendations,
                };
            },
        );
    }

    public rejectRecommendation(
        recommendationHash: RecommendationHash,
    ) {
        this._rejectedRecommendationHashes.add(recommendationHash);
        this._recommendationMap.delete(recommendationHash);

        // TODO run the callback
    }

    public onFileTextChanged(
        document: vscode.TextDocument,
        rangeCriterion: RangeCriterion,
    ) {
        if (document.uri.scheme !== 'file') {
            return;
        }

        const { fileName } = document;
        const fileText = document.getText();

        const userCommand: MoveTopLevelNodeUserCommand = {
            kind: 'MOVE_TOP_LEVEL_NODE',
            fileName,
            fileText,
            options: this._configurationContainer.get(),
            rangeCriterion,
        };

        const fact = buildMoveTopLevelNodeFact(userCommand);

        const recommendations: ReadonlyArray<IntuitaRecommendation> = fact.solutions.flatMap(
            (solutions) => {
                const solution = solutions[0] ?? null;

                if (solution === null) {
                    return null;
                }

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

                const hash = buildRecommendationHash(
                    fileName,
                    oldIndex,
                    newIndex,
                );

                if (this._rejectedRecommendationHashes.has(hash)) {
                    return null;
                }

                return {
                    hash,
                    range,
                    title,
                    // fact,
                    oldIndex,
                    newIndex,
                };
            }
        )
            .filter(isNeitherNullNorUndefined);

        const fileNameHash = buildFileNameHash(fileName);

        this._documentMap.set(fileNameHash, document);
        this._factMap.set(fileNameHash, fact);

        const recommendationHashes = new Set(
            recommendations.map(({ hash }) => hash)
        );

        this._recommendationHashMap.set(fileNameHash, recommendationHashes);
        
        recommendations.forEach((recommendation) => {
            this._recommendationMap.set(
                recommendation.hash,
                recommendation,
            );
        });

        this._setDiagnosticEntry(
            fileName,
            recommendations,
        );
    }

    public findCodeActions(
        fileName: string,
        position: IntuitaPosition,
    ): ReadonlyArray<IntuitaCodeAction> {
        const fileNameHash = buildFileNameHash(fileName);

        const fact = this._factMap.get(fileNameHash);
        const recommendationHashes = this._recommendationHashMap.get(fileNameHash);

        assertsNeitherNullOrUndefined(fact);
        assertsNeitherNullOrUndefined(recommendationHashes);

        const recommendations = Array.from(recommendationHashes.keys()).map(
            (recommendationHash) => {
                if (this._rejectedRecommendationHashes.has(recommendationHash)) {
                    return null;
                }

                return this._recommendationMap.get(recommendationHash);
            }
        )
            .filter(isNeitherNullNorUndefined);
        

        return recommendations
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
        const fileNameHash = buildFileNameHash(fileName);

        const document = this._documentMap.get(fileNameHash);
        const fact = this._factMap.get(fileNameHash);

        assertsNeitherNullOrUndefined(document);
        assertsNeitherNullOrUndefined(fact);

        const fileText = document.getText();

        const {
            stringNodes,
        } = fact;

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