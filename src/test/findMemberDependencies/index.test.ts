import {ClassDeclaration, Project, ts} from "ts-morph";
import {buildCaseMap} from "../buildCaseMap";
import {assert} from "chai";
import {getClassInstanceProperties} from "../../tsMorphAdapter/getClassInstanceProperties";
import {getMethodMap} from "../../intuitaExtension/getMethodMap";
import {Mutability} from "../../intuitaExtension/mutability";
import {getClassInstanceMethods} from "../../tsMorphAdapter/getClassInstanceMethods";
import {getGroupMap} from "../../intuitaExtension/getGroupMap";

function assertNeitherNullNorUndefined<T>(value: NonNullable<T> | null | undefined): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error('The provided value must neither be null nor undefined');
    }
}

describe('find member dependencies', () => {
    const caseMap = buildCaseMap(
        __dirname,
    );

    for(const [caseNumber, { old: oldSourceFileText }] of caseMap.entries()) {
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
            const methodNames = getClassInstanceMethods(classDefinition);

            const methodMap = getMethodMap(properties, methodNames);
            const groupMap = getGroupMap(methodMap, null);

            switch(caseNumber) {
                case 1: {
                    assert.equal(methodMap.size, 0);
                    assert.equal(groupMap.size, 0);
                    return;
                }

                case 2: {
                    {
                        assert.equal(methodMap.size, 1);

                        const ma = methodMap.get('ma');

                        assertNeitherNullNorUndefined(ma);

                        assert.equal(ma.propertyMutability, Mutability.READING_READONLY)
                        assert.deepEqual(ma.propertyNames, []);
                        assert.deepEqual(ma.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        const group0 = groupMap.get(0);

                        assertNeitherNullNorUndefined(group0);

                        assert.deepEqual(group0.methodNames, ['ma']);
                        assert.deepEqual(group0.propertyNames, []);
                        assert.equal(group0.mutability, Mutability.READING_READONLY);
                    }
                    return;
                }

                case 3: {
                    {
                        assert.equal(methodMap.size, 1);

                        const ma = methodMap.get('ma');

                        assertNeitherNullNorUndefined(ma);

                        assert.equal(ma.propertyMutability, Mutability.READING_READONLY)
                        assert.deepEqual(ma.propertyNames, ['pa']);
                        assert.deepEqual(ma.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        const group0 = groupMap.get(0);

                        assertNeitherNullNorUndefined(group0);

                        assert.deepEqual(group0.methodNames, ['ma']);
                        assert.deepEqual(group0.propertyNames, ['pa']);
                        assert.equal(group0.mutability, Mutability.READING_READONLY);
                    }
                    return;
                }

                case 4: {
                    {
                        assert.equal(methodMap.size, 1);

                        const ma = methodMap.get('ma');

                        assertNeitherNullNorUndefined(ma);

                        assert.equal(ma.propertyMutability, Mutability.WRITING_WRITABLE)
                        assert.deepEqual(ma.propertyNames, ['pa']);
                        assert.deepEqual(ma.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        const group0 = groupMap.get(0);

                        assertNeitherNullNorUndefined(group0);

                        assert.deepEqual(group0.methodNames, ['ma']);
                        assert.deepEqual(group0.propertyNames, ['pa']);
                        assert.equal(group0.mutability, Mutability.WRITING_WRITABLE);
                    }
                    return;
                }

                case 5: {
                    {
                        assert.equal(methodMap.size, 1);

                        const ma = methodMap.get('ma');

                        assertNeitherNullNorUndefined(ma);

                        assert.equal(ma.propertyMutability, Mutability.READING_READONLY)
                        assert.deepEqual(ma.propertyNames, ['pa', 'pb', 'pc']);
                        assert.deepEqual(ma.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        const group0 = groupMap.get(0);

                        assertNeitherNullNorUndefined(group0);

                        assert.deepEqual(group0.methodNames, ['ma']);
                        assert.deepEqual(group0.propertyNames, ['pa', 'pb', 'pc']);
                        assert.equal(group0.mutability, Mutability.READING_READONLY);
                    }
                    return;
                }

                case 6: {
                    {
                        assert.equal(methodMap.size, 1);

                        const ma = methodMap.get('ma');

                        assertNeitherNullNorUndefined(ma);

                        assert.equal(ma.propertyMutability, Mutability.WRITING_WRITABLE)
                        assert.deepEqual(ma.propertyNames, ['pa', 'pb', 'pc']);
                        assert.deepEqual(ma.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        const group0 = groupMap.get(0);

                        assertNeitherNullNorUndefined(group0);

                        assert.deepEqual(group0.methodNames, ['ma']);
                        assert.deepEqual(group0.propertyNames, ['pa', 'pb', 'pc']);
                        assert.equal(group0.mutability, Mutability.WRITING_WRITABLE);
                    }
                    return;
                }
                case 7: {
                    {
                        assert.equal(methodMap.size, 1);

                        const ma = methodMap.get('ma');

                        assertNeitherNullNorUndefined(ma);

                        assert.equal(ma.propertyMutability, Mutability.WRITING_WRITABLE)
                        assert.deepEqual(ma.propertyNames, ['pa', 'pb', 'pc']);
                        assert.deepEqual(ma.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        const group0 = groupMap.get(0);

                        assertNeitherNullNorUndefined(group0);

                        assert.deepEqual(group0.methodNames, ['ma']);
                        assert.deepEqual(group0.propertyNames, ['pa', 'pb', 'pc']);
                        assert.equal(group0.mutability, Mutability.WRITING_WRITABLE);
                    }
                    return;
                }

                case 8: {
                    {
                        assert.equal(methodMap.size, 3);

                        const ma = methodMap.get('ma');
                        const mb = methodMap.get('mb');
                        const mc = methodMap.get('mc');

                        assertNeitherNullNorUndefined(ma);
                        assertNeitherNullNorUndefined(mb);
                        assertNeitherNullNorUndefined(mc);

                        assert.equal(ma.propertyMutability, Mutability.WRITING_WRITABLE)
                        assert.deepEqual(ma.propertyNames, ['pa']);
                        assert.deepEqual(ma.methodNames, []);

                        assert.equal(mb.propertyMutability, Mutability.WRITING_WRITABLE)
                        assert.deepEqual(mb.propertyNames, ['pb']);
                        assert.deepEqual(mb.methodNames, []);

                        assert.equal(mc.propertyMutability, Mutability.WRITING_WRITABLE)
                        assert.deepEqual(mc.propertyNames, ['pc']);
                        assert.deepEqual(mc.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 3);

                        {
                            const group0 = groupMap.get(0);

                            assertNeitherNullNorUndefined(group0);

                            assert.deepEqual(group0.methodNames, ['ma']);
                            assert.deepEqual(group0.propertyNames, ['pa']);
                            assert.equal(group0.mutability, Mutability.WRITING_WRITABLE);
                        }

                        {
                            const group1 = groupMap.get(1);

                            assertNeitherNullNorUndefined(group1);

                            assert.deepEqual(group1.methodNames, ['mb']);
                            assert.deepEqual(group1.propertyNames, ['pb']);
                            assert.equal(group1.mutability, Mutability.WRITING_WRITABLE);
                        }

                        {
                            const group2 = groupMap.get(2);

                            assertNeitherNullNorUndefined(group2);

                            assert.deepEqual(group2.methodNames, ['mc']);
                            assert.deepEqual(group2.propertyNames, ['pc']);
                            assert.equal(group2.mutability, Mutability.WRITING_WRITABLE);
                        }
                    }
                    return;
                }

                case 9: {
                    {
                        assert.equal(methodMap.size, 3);

                        const ma = methodMap.get('ma');
                        const mb = methodMap.get('mb');
                        const mc = methodMap.get('mc');

                        assertNeitherNullNorUndefined(ma);
                        assertNeitherNullNorUndefined(mb);
                        assertNeitherNullNorUndefined(mc);

                        assert.equal(ma.propertyMutability, Mutability.READING_READONLY)
                        assert.deepEqual(ma.propertyNames, []);
                        assert.deepEqual(ma.methodNames, ['mb']);

                        assert.equal(mb.propertyMutability, Mutability.READING_READONLY)
                        assert.deepEqual(mb.propertyNames, []);
                        assert.deepEqual(mb.methodNames, ['mc']);

                        assert.equal(mc.propertyMutability, Mutability.READING_READONLY)
                        assert.deepEqual(mc.propertyNames, []);
                        assert.deepEqual(mc.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        {
                            const group0 = groupMap.get(0);

                            assertNeitherNullNorUndefined(group0);

                            assert.deepEqual(group0.methodNames, ['ma', 'mb', 'mc']);
                            assert.deepEqual(group0.propertyNames, []);
                            assert.equal(group0.mutability, Mutability.READING_READONLY);
                        }
                    }
                    return;
                }
                case 10: {
                    {
                        assert.equal(methodMap.size, 1);

                        const ma = methodMap.get('ma');

                        assertNeitherNullNorUndefined(ma);

                        assert.equal(ma.propertyMutability, Mutability.READING_READONLY)
                        assert.deepEqual(ma.propertyNames, []);
                        assert.deepEqual(ma.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        {
                            const group0 = groupMap.get(0);

                            assertNeitherNullNorUndefined(group0);

                            assert.deepEqual(group0.methodNames, ['ma']);
                            assert.deepEqual(group0.propertyNames, []);
                            assert.equal(group0.mutability, Mutability.READING_READONLY);
                        }
                    }
                    return;
                }
                case 11: {
                    {
                        assert.equal(methodMap.size, 2);

                        const ma = methodMap.get('ma');
                        const mb = methodMap.get('mb');

                        assertNeitherNullNorUndefined(ma);
                        assertNeitherNullNorUndefined(mb);

                        assert.equal(ma.propertyMutability, Mutability.READING_READONLY);
                        assert.deepEqual(ma.propertyNames, []);
                        assert.deepEqual(ma.methodNames, ['mb']);

                        assert.equal(mb.propertyMutability, Mutability.READING_READONLY);
                        assert.deepEqual(mb.propertyNames, []);
                        assert.deepEqual(mb.methodNames, ['ma']);
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        {
                            const group0 = groupMap.get(0);

                            assertNeitherNullNorUndefined(group0);

                            assert.deepEqual(group0.methodNames, ['ma', 'mb']);
                            assert.deepEqual(group0.propertyNames, []);
                            assert.equal(group0.mutability, Mutability.READING_READONLY);
                        }
                    }
                    return;
                }
                case 12: {
                    {
                        assert.equal(methodMap.size, 4);

                        const ma = methodMap.get('ma');
                        const mb = methodMap.get('mb');
                        const mc = methodMap.get('mc');
                        const md = methodMap.get('md');

                        assertNeitherNullNorUndefined(ma);
                        assertNeitherNullNorUndefined(mb);
                        assertNeitherNullNorUndefined(mc);
                        assertNeitherNullNorUndefined(md);

                        assert.equal(ma.propertyMutability, Mutability.READING_READONLY);
                        assert.deepEqual(ma.propertyNames, []);
                        assert.deepEqual(ma.methodNames, ['mb']);

                        assert.equal(mb.propertyMutability, Mutability.READING_READONLY);
                        assert.deepEqual(mb.propertyNames, []);
                        assert.deepEqual(mb.methodNames, ['ma']);

                        assert.equal(mc.propertyMutability, Mutability.READING_READONLY);
                        assert.deepEqual(mc.propertyNames, []);
                        assert.deepEqual(mc.methodNames, ['md']);

                        assert.equal(md.propertyMutability, Mutability.READING_READONLY);
                        assert.deepEqual(md.propertyNames, []);
                        assert.deepEqual(md.methodNames, []);
                    }

                    {
                        assert.equal(groupMap.size, 2);

                        {
                            const group = groupMap.get(0);

                            assertNeitherNullNorUndefined(group);

                            assert.deepEqual(group.methodNames, ['mc', 'md']);
                            assert.deepEqual(group.propertyNames, []);
                            assert.equal(group.mutability, Mutability.READING_READONLY);
                        }

                        {
                            const group = groupMap.get(1);

                            assertNeitherNullNorUndefined(group);

                            assert.deepEqual(group.methodNames, ['ma', 'mb']);
                            assert.deepEqual(group.propertyNames, []);
                            assert.equal(group.mutability, Mutability.READING_READONLY);
                        }
                    }
                    return;
                }
                case 12: {
                    {
                        assert.equal(methodMap.size, 2);

                        {
                            const ma = methodMap.get('ma');
                            assertNeitherNullNorUndefined(ma);

                            assert.equal(ma.propertyMutability, Mutability.WRITING_WRITABLE);
                            assert.deepEqual(ma.propertyNames, ['pa']);
                            assert.deepEqual(ma.methodNames, ['mb']);
                        }

                        {
                            const mb = methodMap.get('mb');
                            assertNeitherNullNorUndefined(mb);

                            assert.equal(mb.propertyMutability, Mutability.WRITING_WRITABLE);
                            assert.deepEqual(mb.propertyNames, ['pb']);
                            assert.deepEqual(mb.methodNames, ['ma']);
                        }
                    }

                    {
                        assert.equal(groupMap.size, 1);

                        {
                            const group = groupMap.get(0);

                            assertNeitherNullNorUndefined(group);

                            assert.deepEqual(group.methodNames, ['ma', 'mb']);
                            assert.deepEqual(group.propertyNames, ['pa', 'pb']);
                            assert.equal(group.mutability, Mutability.WRITING_WRITABLE);
                        }
                    }
                    return;
                }
            }
        });
    }
});