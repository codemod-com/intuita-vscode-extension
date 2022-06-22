import {Project, ts} from "ts-morph";
import {AstChangeApplier} from "../../astChangeApplier";
import {buildCaseMap} from "../buildCaseMap";
import {AstChangeKind} from "../../getAstChanges";
import {assert} from "chai";
import {isNeitherNullNorUndefined} from "../../utilities";

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

            const properties = classDefinition
                .getInstanceProperties()
                .map(
                    (instanceProperty) => {
                        const name = instanceProperty.getName();
                        const readonly = Boolean(
                            instanceProperty.getCombinedModifierFlags() & ts.ModifierFlags.Readonly
                        );

                        const methodNames = instanceProperty
                            .findReferences()
                            .flatMap((referencedSymbol) => referencedSymbol.getReferences())
                            .map(
                                (referencedSymbolEntry) => {
                                    return referencedSymbolEntry
                                        .getNode()
                                        .getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration)
                                }
                            )
                            .filter(isNeitherNullNorUndefined)
                            .map(
                                (methodDeclaration) => {
                                    const methodName = methodDeclaration.getName();

                                    const methodClassDeclaration = methodDeclaration
                                        .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration)

                                    if (methodClassDeclaration !== classDefinition) {
                                        return null;
                                    }

                                    return methodName;
                                }
                            )
                            .filter(isNeitherNullNorUndefined)
                        ;

                        return {
                            name,
                            readonly,
                            methodNames,
                        };
                    }
                );

            const enum Mutability {
                READING_READONLY = 1,
                READING_WRITABLE = 2,
                WRITING_WRITABLE = 3,
            }

            const methodNameToPropertyNamesMap = new Map<string, string[]>();
            const methodNameToMutabilityMap = new Map<string, Mutability>();

            properties.forEach(
                (property) => {
                    property.methodNames.forEach(
                        (methodName) => {
                            const propertyNames = methodNameToPropertyNamesMap.get(methodName) ?? [];
                            propertyNames.push(property.name);

                            methodNameToPropertyNamesMap.set(methodName, propertyNames);

                            let mutability = methodNameToMutabilityMap.get(methodName)

                            mutability = property.readonly && ((mutability ?? Mutability.READING_READONLY) === Mutability.READING_READONLY)
                                ? Mutability.READING_READONLY
                                : Mutability.WRITING_WRITABLE;

                            // does not support RW
                            methodNameToMutabilityMap.set(methodName, mutability)
                        }
                    )
                }
            )

            console.log(methodNameToPropertyNamesMap);
            console.log(methodNameToMutabilityMap);
        });
    }
});