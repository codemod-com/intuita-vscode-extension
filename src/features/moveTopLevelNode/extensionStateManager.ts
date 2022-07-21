import { Configuration } from "../../configuration";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {calculatePosition} from "../../utilities";
import {Diagnostic, DiagnosticSeverity, Position, Range} from "vscode";

export class ExtensionStateManager {
    public constructor(
        protected readonly _configuration: Configuration,
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

        return fact.solutions.map(
            (solutions, index) => {
                const topLevelNode = fact.topLevelNodes[index]!;

                const solution = solutions[0]!;

                const title = buildTitle(solution, false) ?? '';

                const start = calculatePosition(
                    fact.separator,
                    fact.lengths,
                    topLevelNode.nodeStart,
                );

                const startPosition = new Position(
                    start[0],
                    start[1]
                );

                const endPosition = new Position(
                    start[0],
                    fact.lengths[start[0]] ?? start[1]
                );

                const range = new Range(
                    startPosition,
                    endPosition,
                );

                return new Diagnostic(
                    range,
                    title,
                    DiagnosticSeverity.Information
                );
            }
        );
    }
}