import {AstChangeApplier} from "../../astChangeApplier";
import {AstChangeKind} from "../../getAstChanges";
import {buildCaseMap} from "../buildCaseMap";
import {Project} from "ts-morph";
import {assert} from "chai";

describe.only('split classes with imports', () => {
    const caseMap = buildCaseMap(
        __dirname,
    );

    for(const [caseNumber, {
        oldA: oldASourceFileText,
        oldB: oldBSourceFileText,
        newA: newASourceFileText,
        newB: newBSourceFileText,
    }] of caseMap.entries()) {
        it(`should implement case ${caseNumber}`, () => {
            const project = new Project({
                useInMemoryFileSystem: true,
            });

            project.createSourceFile(
                'a.ts',
                oldASourceFileText,
            );

            project.createSourceFile(
                'b.ts',
                oldBSourceFileText,
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

            assert.equal(sourceFiles[0]?.[0], '/a.ts');
            assert.equal(sourceFiles[0]?.[1], newASourceFileText);

            assert.equal(sourceFiles[1]?.[0], '/b.ts');
            assert.equal(sourceFiles[1]?.[1], newBSourceFileText);
        });
    }
});