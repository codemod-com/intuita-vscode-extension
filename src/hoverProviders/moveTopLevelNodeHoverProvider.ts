import { Hover, MarkdownString, Position, ProviderResult, Range, TextDocument, Uri } from "vscode";
import { buildTitle } from "../actionProviders/moveTopLevelNodeActionProvider";
import { getConfiguration } from "../configuration";
import { buildFact } from "../features/moveTopLevelNode/builder";
import { calculatePosition } from "../utilities";

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

        const fact = buildFact(
            fileName,
            fileText,
            [fileLine, fileCharacter],
            configuration,
        );

        if (fact === null) {
            return new Hover([]);
        }

        const {
            topLevelNode,
            solution,
            characterDifference,
        } = fact;

        const { oldIndex, newIndex } = solution;

        const args = {
            fileName,
            oldIndex,
            newIndex,
            characterDifference,
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

        const start = calculatePosition(
            fact.fact.separator,
            fact.fact.lengths,
            topLevelNode.start,
        );

        const end = calculatePosition(
            fact.fact.separator,
            fact.fact.lengths,
            topLevelNode.end,
        );

        const startPosition = new Position(start[0], start[1]);
        const endPosition = new Position(end[0], end[1]);

        const range = new Range(
            startPosition,
            endPosition,
        );

        return new Hover(
            contents,
            range,
        );
    }
};