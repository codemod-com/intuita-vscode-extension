import {Project} from "ts-morph";
import {AstChangeApplier} from "../../astChangeApplier";
import {AstChangeKind} from "../../getAstChanges";
import {assert} from "chai";
import {buildCaseMap} from "../buildCaseMap";

describe('move static properties out of class - import/export', () => {
    it('should provide proper imports and exports', () => {
        const caseMap = buildCaseMap(
            __dirname,
        );

        const currentCase = caseMap.get(1);

        if (!currentCase) {
            throw new Error('The case must exist.');
        }

        const project = new Project({
            useInMemoryFileSystem: true,
        });

        project.createSourceFile(
            'a.ts',
            currentCase.oldA,
        );

        project.createSourceFile(
            'b.ts',
            currentCase.oldB,
        );

        const applier = new AstChangeApplier(
            project,
            [
                {
                    kind: AstChangeKind.CLASS_SPLIT_COMMAND,
                    filePath: 'a.ts',
                    className: 'A',
                }
            ],
        );

        const sourceFiles = applier.applyChanges();

        assert.equal(sourceFiles.length, 2);

        assert.equal(sourceFiles[0]![0], '/b.ts');
        assert.equal(sourceFiles[0]![1], currentCase.newB);

        assert.equal(sourceFiles[1]![0], '/a.ts');
        assert.equal(sourceFiles[1]![1], currentCase.newA);
    });
});