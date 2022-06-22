import {Project, ts} from "ts-morph";
import {AstChangeApplier} from "../../astChangeApplier";
import {buildCaseMap} from "../buildCaseMap";
import {AstChangeKind} from "../../getAstChanges";
import {assert} from "chai";

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

            const readonlyMethodNameSet = new Set<string>();
            const methodNameToPropertyNamesMap = new Map<string, string[]>();

            classDefinition
                .getInstanceProperties()
                .forEach(
                    (instanceProperty) => {
                        const propertyName = instanceProperty.getName();

                        instanceProperty
                            .findReferences()
                            .flatMap((referencedSymbol) => referencedSymbol.getReferences())
                            .forEach(
                                (referencedSymbolEntry) => {
                                    const methodDeclaration = referencedSymbolEntry
                                        .getNode()
                                        .getFirstAncestorByKind(ts.SyntaxKind.MethodDeclaration)

                                    if (!methodDeclaration) {
                                        return;
                                    }

                                    const methodName = methodDeclaration.getName();

                                    const methodClassDeclaration = methodDeclaration
                                        .getFirstAncestorByKind(ts.SyntaxKind.ClassDeclaration)

                                    if (methodClassDeclaration === classDefinition) {
                                        const propertyNames = methodNameToPropertyNamesMap.get(methodName) ?? [];

                                        propertyNames.push(propertyName);

                                        methodNameToPropertyNamesMap.set(
                                            methodName,
                                            propertyNames,
                                        );
                                    }
                                }
                            );
                    }
                );

            console.log(methodNameToPropertyNamesMap);

            const methodClassification = [
                {
                    name: 'ma',
                    kind: 'rr',
                    properties: ['pa']
                }
            ];
        });
    }
});