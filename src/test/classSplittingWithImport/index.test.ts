import {AstChangeApplier} from "../../astChangeApplier";
import {AstChangeKind} from "../../getAstChanges";
import {buildCaseMap} from "../buildCaseMap";
import {Project} from "ts-morph";
import {assert} from "chai";

describe.only('split classes with imports', () => {
    const caseMap = buildCaseMap(
        __dirname,
    );

    for(const [caseNumber, { oldA: oldSourceFileText, newA: newSourceFileText }] of caseMap.entries()) {
        it(`should implement case ${caseNumber}`, () => {
            const project = new Project({
                useInMemoryFileSystem: true,
            });

            const sourceFile = project.createSourceFile(
                'a.ts',
                oldSourceFileText,
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

            assert.equal(sourceFiles.length, 1);

            assert.equal(sourceFiles[0]?.[0], '/a.ts');
            assert.equal(sourceFiles[0]?.[1], newSourceFileText);
        });
    }
});