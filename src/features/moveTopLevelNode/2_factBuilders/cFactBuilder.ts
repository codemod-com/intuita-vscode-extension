import {TopLevelNode, TriviaNode, TriviaNodeKind} from "./topLevelNode";
import {CharStreams} from "antlr4ts";
import {CLexer} from "../../../antlrC/CLexer";
import {BufferedTokenStream} from "antlr4ts/BufferedTokenStream";
import {isNeitherNullNorUndefined} from "../../../utilities";

export const buildTriviaNodes = (
    fileText: string,
): ReadonlyArray<TriviaNode> => {
    const inputStream = CharStreams.fromString(fileText);

    const lexer = new CLexer(inputStream);
    const tokenStream = new BufferedTokenStream(lexer);

    tokenStream.fill();

    return tokenStream
        .getTokens()
        .filter(token => token.channel === 1)
        .map((token) => {

            const text = token.text;

            const start = token.startIndex;
            const end = token.stopIndex;

            if (text === '\n') {
                return {
                    kind: TriviaNodeKind.NEW_LINE,
                    start,
                    end,
                };
            }

            if (text?.startsWith('/**') || text?.startsWith('//')) {
                return {
                    kind: TriviaNodeKind.COMMENT,
                    start,
                    end,
                };
            }

            return null;
        })
        .filter(isNeitherNullNorUndefined);
};

export const buildCTopLevelNodes = (
    fileText: string,
): ReadonlyArray<TopLevelNode> => {
    const triviaNodes = buildTriviaNodes(fileText);

    const lines = fileText.split('\n');
    const lengths = lines.map(line => (line.length + 1));

    const inputStream = CharStreams.fromString(fileText);

    // TODO
    return [];
}