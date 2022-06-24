import {AstChangeApplier} from "../../astChangeApplier";
import {AstChangeKind} from "../../getAstChanges";
import {buildCaseMap} from "../buildCaseMap";
import {Project} from "ts-morph";

describe.only('split classes', () => {
    const caseMap = buildCaseMap(
        __dirname,
    );

    for(const [caseNumber, { old: oldSourceFileText, new: newSourceFileText }] of caseMap.entries()) {
        it(`should implement case ${caseNumber}`, () => {
            const project = new Project({
                useInMemoryFileSystem: true,
            });

            const sourceFile = project.createSourceFile(
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

            switch(caseNumber) {
                case 8: {
                    console.log(sourceFiles)
                }
            }
        });
    }
});