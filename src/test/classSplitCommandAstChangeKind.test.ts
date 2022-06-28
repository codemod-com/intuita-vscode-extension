import {AstChange, AstChangeKind, getAstChanges} from "../getAstChanges";
import {assert} from "chai";

describe('classSplitCommandAstChangeKind', () => {

    it('should find AST changes for the split command', () => {
        const sourceFileTexts = [
            [
                `class A {}\nclass B {}\n`,
                `// split\nclass A {}\nclass B {}\n`
            ] as const,
            // TODO in the future we might support other patterns
        ];

        for(const [oldSourceFileText, newSourceFileText] of sourceFileTexts) {
            const astChanges = getAstChanges(
                'index.ts',
                oldSourceFileText,
                newSourceFileText,
            );

            const astChange: AstChange = {
                kind: AstChangeKind.CLASS_SPLIT_COMMAND,
                filePath: 'index.ts',
                className: 'A',
                maxGroupCount: null,
            };

            assert.deepEqual(astChanges, [ astChange ])
        }
    });
});