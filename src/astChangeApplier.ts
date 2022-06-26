import {Node, Project, SourceFile, StatementedNode, SyntaxKind, ts, VariableDeclarationKind} from "ts-morph";
import {AstChange, AstChangeKind} from "./getAstChanges";
import {ClassReferenceKind, getClassReferences} from "./tsMorphAdapter/getClassReferences";
import {getClassCommentStatement} from "./tsMorphAdapter/getClassCommentStatement";
import {getClassStaticProperties} from "./tsMorphAdapter/getClassStaticProperties";
import {getClassStaticMethod} from "./tsMorphAdapter/getClassStaticMethods";
import {getClassInstanceProperties} from "./tsMorphAdapter/getClassInstanceProperties";
import {getClassInstanceMethods} from "./tsMorphAdapter/getClassInstanceMethods";
import {getMethodMap} from "./intuitaExtension/getMethodMap";
import {getGroupMap} from "./intuitaExtension/getGroupMap";
import {lookupNode} from "./tsMorphAdapter/nodeLookup";
import {isNeitherNullNorUndefined} from "./utilities";
import {getClassConstructors} from "./tsMorphAdapter/getClassConstructors";

class ReadonlyArrayMap<K, I> extends Map<K, ReadonlyArray<I>> {
    public addItem(key: K, item: I): void {
        const items = this.get(key)?.slice() ?? [];

        items.push(item);

        this.set(key, items);
    }
}

export class AstChangeApplier {
    protected _changedSourceFiles = new Set<SourceFile>();

    public constructor(
        protected _project: Project,
        protected readonly _astChanges: ReadonlyArray<AstChange>,
    ) {
    }

    public applyChanges(): ReadonlyArray<[string, string]> {
        this._astChanges.forEach((astChange) => {
            switch(astChange.kind) {
                case AstChangeKind.ARROW_FUNCTION_PARAMETER_DELETED:
                    this._applyArrowFunctionParameterDeletedChange(astChange);
                    return;
                case AstChangeKind.FUNCTION_PARAMETER_DELETED:
                    this._applyFunctionParameterDeletedChange(astChange);
                    return;
                case AstChangeKind.CLASS_METHOD_PARAMETER_DELETED:
                    this._applyClassMethodParameterDeletedChange(astChange);
                    return;
                case AstChangeKind.CLASS_SPLIT_COMMAND:
                    this._applyClassSplitCommandChange(astChange);
            }
        });

        const sourceFiles: [string,string][] = [];

        Array.from(this._changedSourceFiles).sort(
            (a, b) => {
                return a.getFilePath().localeCompare(b.getFilePath());
            }
        ).forEach(
            (sourceFile) => {
                sourceFiles.push([
                    sourceFile.getFilePath(),
                    sourceFile.getFullText()
                ]);

                sourceFile.saveSync();
            }
        );

        return sourceFiles;
    }

    protected _applyClassMethodParameterDeletedChange(
        astChange: AstChange & { kind: AstChangeKind.CLASS_METHOD_PARAMETER_DELETED },
    ) {
        const index = astChange.parameters.findIndex(p => p === astChange.parameter);

        if (index === -1) {
            return;
        }

        const sourceFile = this._project.getSourceFile(astChange.filePath)

        if (!sourceFile) {
            return;
        }

        const classDeclaration = sourceFile.getClass(astChange.className);

        if (!classDeclaration) {
            return;
        }

        const methodDeclaration = classDeclaration.getMethod(astChange.methodName);

        if (!methodDeclaration) {
            return;
        }

        methodDeclaration
            .findReferences()
            .flatMap((referencedSymbol) => referencedSymbol.getReferences())
            .forEach(
                (reference) => {
                    const sourceFile = reference.getSourceFile();

                    this._changedSourceFiles.add(sourceFile);

                    const parentNode = reference.getNode().getParent();

                    if (!Node.isPropertyAccessExpression(parentNode)) {
                        return;
                    }

                    const callExpression = parentNode.getParent();

                    if (!Node.isCallExpression(callExpression)) {
                        return;
                    }

                    const argument = callExpression.getArguments()[index];

                    if (!argument) {
                        console.log('no argument')
                        return;
                    }

                    callExpression.removeArgument(argument);
                }
            );
    }

    protected _applyFunctionParameterDeletedChange(
        astChange: AstChange & { kind: AstChangeKind.FUNCTION_PARAMETER_DELETED },
    ) {
        const index = astChange.parameters.findIndex(p => p === astChange.parameter);

        if (index === -1) {
            return;
        }

        const sourceFile = this._project.getSourceFile(astChange.filePath)

        if (!sourceFile) {
            return;
        }

        const functionDeclaration = sourceFile.getFunction(astChange.functionName);

        if (!functionDeclaration) {
            return;
        }

        functionDeclaration
            .findReferences()
            .flatMap((referencedSymbol) => referencedSymbol.getReferences())
            .forEach(
                (reference) => {
                    const sourceFile = reference.getSourceFile();

                    this._changedSourceFiles.add(sourceFile);

                    const parentNode = reference.getNode().getParent();

                    if (!Node.isCallExpression(parentNode)) {
                        return;
                    }

                    const argument = parentNode.getArguments()[index];

                    if (!argument) {
                        return;
                    }

                    parentNode.removeArgument(argument);
                }
            );
    }

    protected _applyArrowFunctionParameterDeletedChange(
        astChange: AstChange & { kind: AstChangeKind.ARROW_FUNCTION_PARAMETER_DELETED },
    ) {
        const index = astChange.parameters.findIndex(p => p === astChange.parameter);

        if (index === -1) {
            return;
        }

        const sourceFile = this._project.getSourceFile(astChange.filePath)

        if (!sourceFile) {
            return;
        }

        const variableDeclaration = sourceFile.getVariableDeclaration(astChange.arrowFunctionName);

        if (!variableDeclaration) {
            return;
        }

        variableDeclaration
            .findReferences()
            .flatMap((referencedSymbol) => referencedSymbol.getReferences())
            .forEach(
                (reference) => {
                    const sourceFile = reference.getSourceFile();

                    this._changedSourceFiles.add(sourceFile);

                    const parentNode = reference.getNode().getParent();

                    if (!Node.isCallExpression(parentNode)) {
                        return;
                    }

                    const argument = parentNode.getArguments()[index];

                    if (!argument) {
                        return;
                    }

                    parentNode.removeArgument(argument);
                }
            );
    }

    protected _applyClassSplitCommandChange(
        astChange: AstChange & { kind: AstChangeKind.CLASS_SPLIT_COMMAND },
    ) {
        const sourceFile = this._project.getSourceFile(astChange.filePath);

        if (!sourceFile) {
            return;
        }

        const classDeclaration = sourceFile
            .getDescendantsOfKind(SyntaxKind.ClassDeclaration)
            .find((cd) => cd.getName() === astChange.className);

        if (!classDeclaration) {
            return;
        }

        const className = classDeclaration.getName();

        const classParentNode = classDeclaration.getParent();



        const classTypeParameters = classDeclaration
            .getTypeParameters()
            .map((tpd) => tpd.getStructure());

        let deletedMemberCount = 0;

        const commentStatement = getClassCommentStatement(classDeclaration);

        const index = classDeclaration.getChildIndex();

        const newImportDeclarationMap = new ReadonlyArrayMap<SourceFile, string>();

        const exported = Node.isSourceFile(classParentNode);

        const staticProperties = getClassStaticProperties(classDeclaration);
        const staticMethods = getClassStaticMethod(classDeclaration);

        const constructors = getClassConstructors(classDeclaration);
        const instanceProperties = getClassInstanceProperties(classDeclaration);
        const instanceMethods = getClassInstanceMethods(classDeclaration);

        const constructorPropertyCount = constructors
            .map(constructor => constructor
                .parameters
                .filter(parameter => Boolean(parameter.scope))
                .length
            )
            .reduce((a, b) => a + b, 0)

        const memberCount = classDeclaration.getMembers().length
            + constructorPropertyCount;

        const methodMap = getMethodMap(instanceProperties, instanceMethods);
        const groupMap = getGroupMap(methodMap);

        staticProperties.forEach(
            (staticProperty) => {
                const { name } = staticProperty;

                staticProperty.propertyAccessExpressions.forEach(
                    ({ sourceFile }) => {
                        newImportDeclarationMap.addItem(
                            sourceFile,
                            name,
                        );
                    }
                );
            }
        );

        staticMethods.forEach(
            (staticMethod) => {

                staticMethod.references.forEach(
                    (reference) => {
                        newImportDeclarationMap.addItem(
                            reference.sourceFile,
                            staticMethod.name,
                        );
                    }
                );
            }
        );

        const classReferences = getClassReferences(classDeclaration);

        // UPDATES
        groupMap.size > 1 && groupMap.forEach(
            (group, groupNumber) => {
                if(!Node.isStatemented(classParentNode)) {
                    return;
                }

                this._changedSourceFiles.add(sourceFile);

                const groupName = `${astChange.className}${groupNumber}`;

                const groupClass = classParentNode.insertClass(index + groupNumber + 1, {
                    name: `${astChange.className}${groupNumber}`,
                    isExported: exported,
                });

                groupClass.addTypeParameters(classTypeParameters);

               let memberIndex = 0;

                constructors.forEach((constructor) => {
                    const { bodyText, parameters, typeParameters } = constructor;

                    const constructorDeclaration = groupClass.insertConstructor(
                        memberIndex,
                        {
                            typeParameters: typeParameters.slice(),
                        }
                    );

                    if (bodyText) {
                        constructorDeclaration.setBodyText(bodyText);
                    }

                    ++memberIndex;
                });

                group.propertyNames.forEach(
                    (propertyName) => {
                        const instanceProperty = instanceProperties.find(
                            (ip) => ip.name === propertyName,
                        );

                        groupClass.insertProperty(
                            memberIndex,
                            {
                                name: propertyName,
                                isReadonly: instanceProperty?.readonly ?? false,
                                initializer: instanceProperty?.initializer ?? undefined,
                            },
                        );

                        ++memberIndex;
                    }
                );

                group.methodNames.forEach(
                    (methodName) => {
                        const instanceMethod = instanceMethods.find(
                            (im) => im.name === methodName,
                        );

                        const methodDeclaration = groupClass.insertMethod(
                            memberIndex,
                            {
                                name: methodName,
                            },
                        );

                        methodDeclaration.addTypeParameters(instanceMethod?.typeParameterDeclarations ?? []);
                        methodDeclaration.addParameters(instanceMethod?.parameters ?? []);

                        if (instanceMethod?.returnType) {
                            methodDeclaration.setReturnType(instanceMethod.returnType);
                        }

                        if (instanceMethod?.bodyText) {
                            methodDeclaration.setBodyText(instanceMethod.bodyText);
                            methodDeclaration.formatText();
                        }

                        ++memberIndex;

                        instanceMethod?.methodLookupCriteria.forEach(
                            (criterion) => {
                                const nodes = lookupNode(
                                    criterion,
                                );

                                nodes
                                    .flatMap(node => node.getPreviousSiblings())
                                    .filter(sibling => sibling.getKind() === ts.SyntaxKind.Identifier)
                                    .forEach(
                                        (node) => node.replaceWithText(
                                            groupName.toLocaleLowerCase()
                                        )
                                    );
                            }
                        );
                    }
                );
            }
        );

        groupMap.size > 1 && instanceMethods.forEach(
            ({ methodDeclaration }) => {
                ++deletedMemberCount;

                methodDeclaration.remove();
            }
        );

        groupMap.size > 1 && instanceProperties.forEach(
            ({instanceProperty}) => {
                ++deletedMemberCount;

                instanceProperty.remove();
            }
        );

        groupMap.size > 1 && constructors.forEach(
            (constructor) => {
                console.log(constructor.criterion,)

                lookupNode(
                    constructor.criterion,
                    false,
                )
                    .filter(Node.isConstructorDeclaration)
                    .forEach(
                        (constructorDeclaration) => {
                            ++deletedMemberCount;
                            constructorDeclaration.remove();
                        }
                    );
            }
        );

        staticProperties.forEach(
            (staticProperty) => {
                if(Node.isStatemented(classParentNode) && staticProperty.propertyAccessExpressions.length) {
                    const declarationKind = staticProperty.readonly
                        ? VariableDeclarationKind.Const
                        : VariableDeclarationKind.Let;

                    const variableStatement = classParentNode.insertVariableStatement(
                        index,
                        {
                            declarationKind,
                            declarations: [
                                {
                                    name: staticProperty.name,
                                    initializer: staticProperty.initializer ?? undefined,
                                }
                            ],
                        }
                    );

                    variableStatement.setIsExported(exported);
                }

                staticProperty.propertyAccessExpressions.forEach(
                    ({ sourceFile, propertyAccessExpression }) => {
                        this._changedSourceFiles.add(sourceFile);

                        propertyAccessExpression.replaceWithText(staticProperty.name);
                    }
                );

                ++deletedMemberCount;

                staticProperty.staticProperty.remove();
            }
        );

        staticMethods
            .forEach(
                (staticMethod) => {
                    if(Node.isStatemented(classParentNode)) {
                        const functionDeclaration = classParentNode.insertFunction(
                            index,
                            {
                                name: staticMethod.name,
                            }
                        );

                        functionDeclaration.setIsExported(true);
                        functionDeclaration.addTypeParameters(staticMethod.typeParameterDeclarations);
                        functionDeclaration.addParameters(staticMethod.parameters);
                        functionDeclaration.setReturnType(staticMethod.returnType);

                        if (staticMethod.bodyText) {
                            functionDeclaration.setBodyText(staticMethod.bodyText);
                            functionDeclaration.formatText();
                        }
                    }

                    staticMethod.references.forEach(
                        (reference) => {
                            reference.callExpression.replaceWithText(reference.text);

                            this._changedSourceFiles.add(reference.sourceFile);
                        }
                    );

                    ++deletedMemberCount;

                    staticMethod.staticMethod.remove();
                }
            );

        if (commentStatement) {
            commentStatement.remove();
        }

        {
            if (deletedMemberCount > 0) {
                this._changedSourceFiles.add(sourceFile);
            }
        }

        console.log(memberCount, deletedMemberCount)

        if (memberCount - deletedMemberCount === 0) {
            classReferences.forEach(
                (classReference) => {
                    if (classReference.kind === ClassReferenceKind.IMPORT_SPECIFIER) {
                        const otherSourceFile = this._project.getSourceFile(classReference.filePath);

                        if (!otherSourceFile) {
                            return;
                        }

                        this._changedSourceFiles.add(otherSourceFile);

                        otherSourceFile
                            .getImportDeclarations()
                            .filter(
                                (id) => {
                                    return id.getModuleSpecifierSourceFile() === sourceFile
                                }
                            )
                            .forEach(
                                (importDeclaration) => {
                                    const namedImports = importDeclaration.getNamedImports();

                                    const namedImport = namedImports
                                        .find(ni => ni.getName()) ?? null;

                                    if (!namedImport) {
                                        return;
                                    }

                                    const count = namedImports.length;

                                    groupMap.forEach(
                                        (group, groupNumber) => {
                                            importDeclaration.insertNamedImport(
                                                groupNumber,
                                                `${className}${groupNumber}`,
                                            );
                                        }
                                    );

                                    // removal
                                    namedImport.remove();

                                    if (count + groupMap.size === 1) {
                                        importDeclaration.remove();
                                    }
                                }
                            );
                    }

                    if (classReference.kind === ClassReferenceKind.NEW_EXPRESSION
                        && !classReference.existingConstructor
                    ) {
                        groupMap.forEach(
                            (group, index) => {
                                const groupName = `${className}${index}`;

                                lookupNode(
                                    classReference.nodeLookupCriterion
                                )
                                    .filter(Node.isNewExpression)
                                    .map(
                                        (newExpression) =>
                                            newExpression.getFirstAncestorByKind(ts.SyntaxKind.VariableDeclaration)
                                    )
                                    .filter(isNeitherNullNorUndefined)
                                    .forEach(
                                        (variableDeclaration) => {
                                            variableDeclaration.remove();
                                        }
                                    );

                                lookupNode(
                                    classReference.nodeLookupCriterion,
                                    true,
                                )
                                    .filter(Node.isStatemented)
                                    .forEach(statementedNode => {
                                        statementedNode.insertVariableStatement(
                                            index,
                                            {
                                                declarationKind: VariableDeclarationKind.Const,
                                                declarations: [
                                                    {
                                                        name: groupName.toLocaleLowerCase(),
                                                        initializer: `new ${groupName}()`
                                                    }
                                                ],
                                            }
                                        );
                                    });
                            }
                        );
                    }
                }
            );

            newImportDeclarationMap.forEach(
                (names, otherSourceFile) => {
                    if (otherSourceFile === sourceFile) {
                        return;
                    }

                    otherSourceFile.insertImportDeclaration(
                        0,
                        {
                            namedImports: names.slice(),
                            moduleSpecifier: otherSourceFile
                                .getRelativePathAsModuleSpecifierTo(sourceFile.getFilePath()),
                        }
                    );
                }
            );

            classDeclaration.remove();
        }
    }
}
