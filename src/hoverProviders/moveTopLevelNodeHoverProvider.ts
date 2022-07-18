import { Hover, MarkdownString, Position, ProviderResult, Range, TextDocument, Uri } from "vscode";
import { buildTitle } from "../actionProviders/moveTopLevelNodeActionProvider";
import { getConfiguration } from "../configuration";
import { buildMoveTopLevelNodeUserCommand } from "../features/moveTopLevelNode/1_userCommandBuilder";
import { buildMoveTopLevelNodeFact } from "../features/moveTopLevelNode/2_factBuilders";

export const moveTopLevelNodeHoverProvider = {
    provideHover(
        document: TextDocument,
        position: Position,
    ): ProviderResult<Hover> {
        const fileName = document.fileName;
        const fileText = document.getText();
        const fileLine = position.line;
        const fileCharacter = position.character;

        const configuration = getConfiguration();

        const userCommand = buildMoveTopLevelNodeUserCommand(
            fileName,
            fileText,
            configuration
        );

        const fact = buildMoveTopLevelNodeFact(userCommand);

        const solutions = fact
            .solutions
            .filter(
                (solution) => {
                    return solution.newIndex !== solution.oldIndex;
                }
            );

        const solution = solutions[0] ?? null;

        if (solution === null) {
            return new Hover([]);
        }

        const { oldIndex, newIndex } = solution;

        const args = {
            fileName,
            oldIndex,
            newIndex,
            characterDifference: fact.characterDifference,
        };

        const encodedArgs = encodeURIComponent(JSON.stringify(args));
        const value = `command:intuita.moveTopLevelNode?${encodedArgs}`;

        const stageCommandUri = Uri.parse(value);
        const title = buildTitle(solution, true);

        const contents = new MarkdownString(
            `${title}<br /><a href="${stageCommandUri}">$(check)</a> $(close)`,
            true
        );
        contents.isTrusted = true;
        contents.supportHtml = true;

        return new Hover(contents, new Range(position, position.translate(1, 1)));
    }
};