import {ts, VariableDeclaration} from "ts-morph";
import {
    getSourceFileNodes,
    isClassDeclaration,
    isExtendedMethodDeclaration,
    SourceFileNode
} from "./getSourceFileNodes";

export enum AstChangeKind {
    ARROW_FUNCTION_PARAMETER_DELETED = 1,
    FUNCTION_PARAMETER_DELETED = 2,
    CLASS_METHOD_PARAMETER_DELETED = 3,
    CLASS_SPLIT_COMMAND = 4,
}

export type AstChange =
    | Readonly<{
        kind: AstChangeKind.ARROW_FUNCTION_PARAMETER_DELETED,
        filePath: string,
        arrowFunctionName: string,
        parameter: string,
        parameters: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: AstChangeKind.FUNCTION_PARAMETER_DELETED,
        filePath: string,
        functionName: string,
        parameter: string,
        parameters: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: AstChangeKind.CLASS_METHOD_PARAMETER_DELETED,
        filePath: string,
        className: string,
        methodName: string,
        parameter: string,
        parameters: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: AstChangeKind.CLASS_SPLIT_COMMAND,
        filePath: string,
        className: string,
    }>;

export const getAstChanges = (
    filePath: string,
    oldSourceFileText: string,
    newSourceFileText: string,
): ReadonlyArray<AstChange> => {
    const astChanges: AstChange[] = [];

    const oldSourceFileNodes = getSourceFileNodes(oldSourceFileText);
    const newSourceFileNodes = getSourceFileNodes(newSourceFileText);

    const oldSourceFileMethods = oldSourceFileNodes
        .filter(isExtendedMethodDeclaration);

    const newSourceFileMethods = newSourceFileNodes
        .filter(isExtendedMethodDeclaration);

    const classDeclarations = newSourceFileNodes.filter(isClassDeclaration)

    classDeclarations.forEach((classDeclaration) => {
        if (!classDeclaration.toSplit) {
            return;
        }

        astChanges.push({
            kind: AstChangeKind.CLASS_SPLIT_COMMAND,
            filePath,
            className: classDeclaration.className,
        });
    });

    oldSourceFileMethods.forEach(
        (oldSfm) => {
            const newSfm = newSourceFileMethods
                .find((newSfm) => {
                    return newSfm.hash === oldSfm.hash
                })

            if (!newSfm) {
                return;
            }

            oldSfm.parameters.forEach(
                (parameter) => {
                    if(newSfm.parameters.includes(parameter)) {
                        return;
                    }

                    switch(oldSfm.kind) {
                        case ts.SyntaxKind.ArrowFunction:
                            {
                                astChanges.push({
                                    kind: AstChangeKind.ARROW_FUNCTION_PARAMETER_DELETED,
                                    filePath,
                                    arrowFunctionName: oldSfm.arrowFunctionName,
                                    parameter,
                                    parameters: oldSfm.parameters,
                                });
                                return;
                            }
                        case ts.SyntaxKind.FunctionDeclaration:
                            {
                                astChanges.push({
                                    kind: AstChangeKind.FUNCTION_PARAMETER_DELETED,
                                    filePath,
                                    functionName: oldSfm.functionName,
                                    parameter,
                                    parameters: oldSfm.parameters,
                                });
                                return;
                            }
                        case ts.SyntaxKind.MethodDeclaration:
                            {
                                astChanges.push({
                                    kind: AstChangeKind.CLASS_METHOD_PARAMETER_DELETED,
                                    filePath,
                                    className: oldSfm.className,
                                    methodName: oldSfm.methodName,
                                    parameter,
                                    parameters: oldSfm.parameters,
                                });
                                return;
                            }
                    }
                }
            )
        }
    )

    return astChanges;
}