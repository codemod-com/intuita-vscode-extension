import {Project} from "ts-morph";
import {AstChangeApplier} from "../../astChangeApplier";
import {buildCaseMap} from "../buildCaseMap";
import {AstChangeKind} from "../../getAstChanges";
import {assert} from "chai";

describe('move static properties out of the class', () => {
    const caseMap = buildCaseMap(
        __dirname,
    );

    for(const [caseNumber, { oldSourceFileText, newSourceFileText }] of caseMap.entries()) {
        it(`should implement case ${caseNumber}`, () => {
            const project = new Project({
                useInMemoryFileSystem: true,
            });

            project.createSourceFile(
                'index.ts',
                oldSourceFileText,
            );

            const applier = new AstChangeApplier(
                project,
                [
                    {
                        kind: AstChangeKind.CLASS_SPLIT_COMMAND,
                        filePath: 'index.ts',
                        className: 'A',
                    }
                ],
            );

            const sourceFiles = applier.applyChanges();

            assert.equal(sourceFiles.length, 1);
            assert.equal(sourceFiles[0]?.[0], '/index.ts');
            assert.equal(sourceFiles[0]?.[1], newSourceFileText);
        });
    }
});