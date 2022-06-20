import {Node, Project, SourceFile} from "ts-morph";
import {AstChange, AstChangeKind} from "./getAstChanges";

export class AstChangeApplier {
    protected _changedSourceFiles = new Set<SourceFile>();

    public constructor(
        protected _project: Project,
        protected _astChanges: ReadonlyArray<AstChange>,
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
            }
        });

        const sourceFiles: [string,string][] = [];

        this._changedSourceFiles.forEach(
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

}
