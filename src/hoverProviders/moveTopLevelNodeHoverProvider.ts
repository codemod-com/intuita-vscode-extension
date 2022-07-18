import { Hover, MarkdownString, Position, ProviderResult, Range, TextDocument, Uri } from "vscode";
import { buildTitle } from "../actionProviders/moveTopLevelNodeActionProvider";
import { getConfiguration } from "../configuration";
import { buildMoveTopLevelNodeUserCommand } from "../features/moveTopLevelNode/1_userCommandBuilder";
import { buildMoveTopLevelNodeFact } from "../features/moveTopLevelNode/2_factBuilders";
import { calculateCharacterIndex, calculatePosition } from "../utilities";

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

        const characterIndex = calculateCharacterIndex(
            fact.separator,
            fact.lengths,
            fileLine,
            fileCharacter,
        );

        const topLevelNodeIndex = fact.topLevelNodes.findIndex(
            (topLevelNode) => {
                return topLevelNode.start <= characterIndex
                    && characterIndex <= topLevelNode.end;
            }
        );

        const topLevelNode = fact.topLevelNodes[topLevelNodeIndex] ?? null;

        if (topLevelNodeIndex === -1 || topLevelNode === null) {
            return new Hover([]);
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
            return new Hover([]);
        }

        const { oldIndex, newIndex } = solution;

        const args = {
            fileName,
            oldIndex,
            newIndex,
            // characterDifference: fact.characterDifference,
            characterDifference: 0, // TODO
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
            fact.separator,
            fact.lengths,
            topLevelNode.start,
        );

        const startPosition = new Position(start[0], start[1]);

        const end = calculatePosition(
            fact.separator,
            fact.lengths,
            topLevelNode.end,
        );

        const endPosition = new Position(end[0], end[1]);

        return new Hover(
            contents,
            new Range(
                startPosition,
                endPosition,
            ),
        );
    }
};