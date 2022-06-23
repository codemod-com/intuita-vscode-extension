/// <reference path="../../tsMorphAdapter/getClassInstanceProperties.ts" />
import {Project, ts} from "ts-morph";
import {AstChangeApplier} from "../../astChangeApplier";
import {buildCaseMap} from "../buildCaseMap";
import {AstChangeKind} from "../../getAstChanges";
import {assert} from "chai";
import {isNeitherNullNorUndefined} from "../../utilities";
import {TsMorphAdapter} from "../../tsMorphAdapter/getClassInstanceProperties";

describe.only('find member dependencies', () => {
    const caseMap = buildCaseMap(
        __dirname,
    );

    for(const [caseNumber, { oldSourceFileText }] of caseMap.entries()) {
        it(`should implement case ${caseNumber}`, () => {
            const project = new Project({
                useInMemoryFileSystem: true,
            });

            const sourceFile = project.createSourceFile(
                'index.ts',
                oldSourceFileText,
            );

            const classDefinition = sourceFile
                .getDescendantsOfKind(ts.SyntaxKind.ClassDeclaration)
                .find((cd) => cd.getName() === 'A');

            if (!classDefinition) {
                return;
            }

            const properties = TsMorphAdapter.getClassInstanceProperties(classDefinition);


        });
    }
});