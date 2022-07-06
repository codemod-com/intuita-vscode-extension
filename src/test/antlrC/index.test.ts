import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { CLexer } from '../../antlrC/CLexer';
import {CParser, DeclarationContext, ExternalDeclarationContext, TranslationUnitContext} from "../../antlrC/CParser";
import {AbstractParseTreeVisitor} from "antlr4ts/tree";
import {CVisitor} from "../../antlrC/CVisitor";
import {assert} from "chai";
import { createHash } from 'crypto';

type TopLevelNode = Readonly<{
    id: string,
    start: number,
    end: number,
    // startLine: number,
    // startPosition: number,
    // endLine: number | null,
    // endPosition: number | null,
}>;

describe('AntlrC', () => {
    it('x', () => {
        const oldText = [
            "",
            "int i = 0b0011;",
            "",
            "int j = 0B1010;",
        ].join('\n');

        const lines = oldText.split('\n');
        const lengths = lines.map(line => (line.length + 1));

        // Create the lexer and parser
        let inputStream = new ANTLRInputStream(oldText);
        let lexer = new CLexer(inputStream);
        let tokenStream = new CommonTokenStream(lexer);
        let parser = new CParser(tokenStream);

        // Parse the input, where `compilationUnit` is whatever entry point you defined
        let tree = parser.compilationUnit();

        // Extend the AbstractParseTreeVisitor to get default visitor behaviour
        class CountFunctionsVisitor
            extends AbstractParseTreeVisitor<ReadonlyArray<TopLevelNode>>
            implements CVisitor<ReadonlyArray<TopLevelNode>>
        {

            defaultResult() {
                return [];
            }

            aggregateResult(aggregate: ReadonlyArray<TopLevelNode>, nextResult: ReadonlyArray<TopLevelNode>) {
                return aggregate.concat(nextResult);
            }

            visitTranslationUnit(ctx: TranslationUnitContext) {
                return this.visitChildren(ctx);
            };

            visitExternalDeclaration(ctx: ExternalDeclarationContext): ReadonlyArray<TopLevelNode> {
                const id = createHash('ripemd160')
                    .update(ctx.text)
                    .digest('base64url');

                console.log(ctx.text);

                const startLine = ctx.start.line - 1;
                const startPosition = ctx.start.charPositionInLine;
                const endLine = (ctx.stop?.line ?? ctx.start.line) - 1;
                const endPosition = (ctx.stop?.charPositionInLine ?? ctx.start.charPositionInLine);

                const start = lengths
                    .slice(0, startLine)
                    .reduce((a, b) => a+b, startPosition);

                const end = lengths
                    .slice(0, endLine)
                    .reduce((a, b) => a+b, endPosition);

                const topLevelNode: TopLevelNode = {
                    id,
                    start,
                    end,
                };

                return [ topLevelNode ];
            };
        }

        // Create the visitor
        const countFunctionsVisitor = new CountFunctionsVisitor();
        // Use the visitor entry point
        const topLevelNodes = countFunctionsVisitor.visit(tree);

        const elements: string[] = [];

        topLevelNodes.forEach(
            (topLevelNode, index) => {
                if (elements.length === 0) {
                    elements.push(
                        oldText.slice(0, topLevelNode.start),
                    );
                }

                elements.push(
                    oldText.slice(topLevelNode.start, topLevelNode.end + 1),
                );

                if (index === (topLevelNodes.length - 1)) {
                    elements.push(
                        oldText.slice(topLevelNode.end + 1),
                    );
                }
            }
        );

        console.log(elements)
        // const newText = value.join('\n');
        //
        // assert.equal(newText, oldText);
    });
});