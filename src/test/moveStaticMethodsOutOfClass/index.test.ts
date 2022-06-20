import {getAstChanges} from "../../getAstChanges";
import {Project} from "ts-morph";
import {assert} from "chai";
import {AstChangeApplier} from "../../astChangeApplier";
import {readFileSync} from "fs";
import {join} from "path";

describe('applyClassSplitCommand', () => {
    it('should apply the split command', () => {
        const sourceFileText1 = readFileSync(join(__dirname, 'sourceFileText1.ts'), 'utf8');
        const sourceFileText2 = readFileSync(join(__dirname, 'sourceFileText2.ts'), 'utf8');
        const sourceFileText3 = readFileSync(join(__dirname, 'sourceFileText3.ts'), 'utf8');

        const astChanges = getAstChanges(
            'index.ts',
            sourceFileText1,
            sourceFileText2,
        );

        const project = new Project({
            useInMemoryFileSystem: true,
        });
        [
            ['index.ts', sourceFileText2] as const,
        ].map(
            ([filePath, sourceFileText]) => {
                project.createSourceFile(
                    filePath,
                    sourceFileText,
                );
            }
        );

        const applier = new AstChangeApplier(
            project,
            astChanges,
        );

        const sourceFiles = applier.applyChanges();

        assert.equal(sourceFiles[0]![1], sourceFileText3);
    });
});