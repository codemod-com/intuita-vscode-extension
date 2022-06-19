import {AstChange, AstChangeKind, getAstChanges} from "../getAstChanges";
import {assert} from "chai";

describe.only('classSplitCommandAstChangeKind', () => {

    it('should find AST changes for the split command', () => {
        const sourceFileTexts = [
            [
                `class A {}`,
                `class A // split
                {}`
            ] as const,
            [
                `class A {}`,
                `// split
                class A {}`
            ] as const,
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
            };

            assert.deepEqual(astChanges, [ astChange ])
        }


    });


});