import {Project, ts} from "ts-morph";
import {buildCaseMap} from "../buildCaseMap";
import {assert} from "chai";
import {getClassInstanceProperties} from "../../tsMorphAdapter/getClassInstanceProperties";
import {getMethodMap} from "../../intuitaExtension/getMethodMap";
import {Mutability} from "../../intuitaExtension/mutability";

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

            const properties = getClassInstanceProperties(classDefinition);

            const methodMap = getMethodMap(properties);

            switch(caseNumber) {
                case 1: {
                    assert.equal(methodMap.size, 0);
                    return;
                }

                case 2: {
                    assert.equal(methodMap.size, 1);
                    assert.equal(methodMap.get('ma')?.mutability, Mutability.READING_READONLY)
                    assert.deepEqual(methodMap.get('ma')?.propertyNames, ['']);
                    return;
                }

                case 3: {
                    assert.equal(methodMap.size, 1);
                    assert.equal(methodMap.get('ma')?.mutability, Mutability.READING_READONLY)
                    assert.deepEqual(methodMap.get('ma')?.propertyNames, ['pa']);
                    return;
                }

                case 4: {
                    assert.equal(methodMap.size, 1);
                    assert.equal(methodMap.get('ma')?.mutability, Mutability.WRITING_WRITABLE)
                    assert.deepEqual(methodMap.get('ma')?.propertyNames, ['pa']);
                    return;
                }

                case 5: {
                    assert.equal(methodMap.size, 1);
                    assert.equal(methodMap.get('ma')?.mutability, Mutability.READING_READONLY)
                    assert.deepEqual(methodMap.get('ma')?.propertyNames, ['pa', 'pb', 'pc']);
                    return;
                }
            }
        });
    }
});