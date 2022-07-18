import {CharStreams, CommonTokenStream} from "antlr4ts";
import {JavaLexer} from "../../../antlrJava/JavaLexer";
import {
    ClassDeclarationContext,
    EnumDeclarationContext,
    IdentifierContext,
    InterfaceDeclarationContext,
    JavaParser,
    TypeDeclarationContext
} from "../../../antlrJava/JavaParser";
import {AbstractParseTreeVisitor} from "antlr4ts/tree";
import {JavaParserVisitor} from "../../../antlrJava/JavaParserVisitor";
import {buildHash, isNeitherNullNorUndefined} from "../../../utilities";
import {TopLevelNode, TopLevelNodeKind, TriviaNode, TriviaNodeKind} from "./topLevelNode";
import {BufferedTokenStream} from "antlr4ts/BufferedTokenStream";

const enum FactKind {
    CLASS_DECLARATION = 1,
    TYPE_DECLARATION = 2,
    IDENTIFIER = 3,
    INTERFACE_DECLARATION = 4,
    ENUM_DECLARATION = 5,
}

type Fact =
    | Readonly<{
        kind: FactKind.CLASS_DECLARATION | FactKind.INTERFACE_DECLARATION | FactKind.ENUM_DECLARATION,
        identifier: string,
        childIdentifiers: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: FactKind.IDENTIFIER,
        identifier: string,
    }>
    | Readonly<{
        kind: FactKind.TYPE_DECLARATION,
        topLevelNode: TopLevelNode,
        children: ReadonlyArray<Fact>,
    }>;

class Visitor
    extends AbstractParseTreeVisitor<ReadonlyArray<Fact>>
    implements JavaParserVisitor<ReadonlyArray<Fact>>
{
    constructor(
        protected readonly _lengths: ReadonlyArray<number>,
    ) {
        super();
    }

    defaultResult() {
        return [];
    }

    aggregateResult(aggregate: ReadonlyArray<Fact>, nextResult: ReadonlyArray<Fact>) {
        return aggregate.concat(nextResult);
    }

    visitIdentifier(
        ctx: IdentifierContext,
    ): ReadonlyArray<Fact> {
        const identifier = ctx.text;

        return [
            {
                kind: FactKind.IDENTIFIER,
                identifier,
            }
        ];
    }

    visitEnumDeclaration(
        ctx: EnumDeclarationContext,
    ): ReadonlyArray<Fact> {
        const identifier = ctx.text;

        return [
            {
                kind: FactKind.ENUM_DECLARATION,
                identifier,
                childIdentifiers: [],
            }
        ];
    }

    visitClassDeclaration(
        ctx: ClassDeclarationContext,
    ): ReadonlyArray<Fact> {
        const identifier = ctx.identifier().text;

        const children = this.visitChildren(ctx);

        const childIdentifiers = children
            .filter((fact): fact is Fact & { kind: FactKind.IDENTIFIER } => fact.kind === FactKind.IDENTIFIER)
            .map((fact) => fact.identifier)
            .filter((i) => i !== identifier);

        return [
            {
                kind: FactKind.CLASS_DECLARATION,
                identifier,
                childIdentifiers,
            },
        ];
    }

    visitInterfaceDeclaration(
        ctx: InterfaceDeclarationContext
    ): ReadonlyArray<Fact> {
        const identifier = ctx.identifier().text;

        const children = this.visitChildren(ctx);

        const childIdentifiers = children
            .filter((fact): fact is Fact & { kind: FactKind.IDENTIFIER } => fact.kind === FactKind.IDENTIFIER)
            .map((fact) => fact.identifier)
            .filter((i) => i !== identifier);

        return [
            {
                kind: FactKind.INTERFACE_DECLARATION,
                identifier,
                childIdentifiers,
            },
        ];
    }

    visitTypeDeclaration(
        ctx: TypeDeclarationContext,
    ): ReadonlyArray<Fact> {
        const id = buildHash(ctx.text);

        const startLine = ctx.start.line - 1;
        const startPosition = ctx.start.charPositionInLine;
        const endLine = (ctx.stop?.line ?? ctx.start.line) - 1;
        const endPosition = (ctx.stop?.charPositionInLine ?? ctx.start.charPositionInLine);

        const start = this._lengths
            .slice(0, startLine)
            .reduce((a, b) => a+b, startPosition);

        const end = this._lengths
            .slice(0, endLine)
            .reduce((a, b) => a+b, endPosition);

        const children = this.visitChildren(ctx);

        const firstChild = children[0] ?? null;

        if (firstChild === null) {
            return [];
        }

        let topLevelNode: TopLevelNode | null = null;

        switch(firstChild.kind) {
            case FactKind.CLASS_DECLARATION:
            {
                topLevelNode = {
                    id,
                    start,
                    bodyStart: null,
                    end,
                    kind: TopLevelNodeKind.CLASS,
                    identifiers: new Set<string>([ firstChild.identifier ]),
                    childIdentifiers: new Set<string>(firstChild.childIdentifiers),
                };
                break;
            }
            case FactKind.INTERFACE_DECLARATION:
            {
                topLevelNode = {
                    id,
                    start,
                    bodyStart: null,
                    end,
                    kind: TopLevelNodeKind.INTERFACE,
                    identifiers: new Set<string>([ firstChild.identifier ]),
                    childIdentifiers: new Set<string>(firstChild.childIdentifiers),
                };
                break;
            }
            case FactKind.ENUM_DECLARATION:
            {
                topLevelNode = {
                    id,
                    start,
                    bodyStart: null,
                    end,
                    kind: TopLevelNodeKind.ENUM,
                    identifiers: new Set<string>([ firstChild.identifier ]),
                    childIdentifiers: new Set<string>(firstChild.childIdentifiers),
                };
                break;
            }
        }

        if (topLevelNode === null) {
            return [];
        }

        return [
            {
                kind: FactKind.TYPE_DECLARATION,
                topLevelNode,
                children,
            },
        ];
    }
}

export const buildTriviaNodes = (
    fileText: string,
): ReadonlyArray<TriviaNode> => {
    const inputStream = CharStreams.fromString(fileText);

    const lexer = new JavaLexer(inputStream);
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

            if (text?.startsWith('/**')) {
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

export const buildJavaTopLevelNodes = (
    fileText: string,
): ReadonlyArray<TopLevelNode> => {
    const triviaNodes = buildTriviaNodes(fileText);

    const lines = fileText.split('\n');
    const lengths = lines.map(line => (line.length + 1));

    const inputStream = CharStreams.fromString(fileText);

    const lexer = new JavaLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new JavaParser(tokenStream);

    const parseTree = parser.compilationUnit();

    const visitor = new Visitor(lengths);

    return visitor
        .visit(parseTree)
        .filter(
            (fact): fact is Fact & { kind: FactKind.TYPE_DECLARATION } => fact.kind === FactKind.TYPE_DECLARATION
        )
        .map((fact, index, facts) => {
            const end = facts[index - 1]?.topLevelNode.end ?? 0;
            const { start } = fact.topLevelNode;

            const newStart = triviaNodes
                .filter((triviaNode) => triviaNode.end < start && triviaNode.start > end)
                .filter((triviaNode) => triviaNode.kind === TriviaNodeKind.COMMENT)
                .slice(-1)
                [0]?.start ?? null;

            return {
                ...fact.topLevelNode,
                start: newStart ?? start,
            };
        });
};
