import { ts } from "ts-morph";
import { getSourceFileMethods } from "./getSourceFileMethods";

export enum AstChangeKind {
    ARROW_FUNCTION_PARAMETER_DELETED = 1,
    FUNCTION_PARAMETER_DELETED = 2,
    CLASS_METHOD_PARAMETER_DELETED = 3,
}

type AstChange =
    | Readonly<{
        kind: AstChangeKind.ARROW_FUNCTION_PARAMETER_DELETED,
        arrowFunctionName: string,
        parameter: string,
        parameters: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: AstChangeKind.FUNCTION_PARAMETER_DELETED,
        functionName: string,
        parameter: string,
        parameters: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: AstChangeKind.CLASS_METHOD_PARAMETER_DELETED,
        className: string,
        methodName: string,
        parameter: string,
        parameters: ReadonlyArray<string>,
    }>

export const getAstChanges = (
    oldSourceFileText: string,
    newSourceFileText: string,
): ReadonlyArray<AstChange> => {
    const astChanges: AstChange[] = [];

    const oldSourceFileMethods = getSourceFileMethods(oldSourceFileText);
    const newSourceFileMethods = getSourceFileMethods(newSourceFileText);

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