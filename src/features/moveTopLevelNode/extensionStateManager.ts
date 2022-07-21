import { Configuration } from "../../configuration";
import {MoveTopLevelNodeUserCommand} from "./1_userCommandBuilder";
import {buildMoveTopLevelNodeFact} from "./2_factBuilders";
import {buildTitle} from "../../actionProviders/moveTopLevelNodeActionProvider";
import {calculatePosition, IntuitaRange} from "../../utilities";

export type IntuitaDiagnostic = Readonly<{
    title: string,
    range: IntuitaRange,
}>;

export class ExtensionStateManager {
    public constructor(
        protected readonly _configuration: Configuration,
        protected readonly _setDiagnosticEntry: (
            fileName: string,
            diagnostics: any[]
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
                };
            }
        );

        this._setDiagnosticEntry(
            fileName,
            diagnostics,
        );
    }
}