import { ts, Project } from "ts-morph";

// export type SourceFileMethod = Readonly<{
//     kind: ts.SyntaxKind.ArrowFunction | ts.SyntaxKind.FunctionDeclaration | ts.SyntaxKind.MethodDeclaration,
//     name: string,
//     parameters: ReadonlyArray<string>,
// }>;

export type SourceFileMethod =
    | Readonly<{
        kind: ts.SyntaxKind.ArrowFunction,
        arrowFunctionName: string,
        hash: string,
        parameters: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: ts.SyntaxKind.FunctionDeclaration,
        functionName: string,
        hash: string,
        parameters: ReadonlyArray<string>,
    }>
    | Readonly<{
        kind: ts.SyntaxKind.MethodDeclaration,
        className: string,
        methodName: string,
        hash: string,
        parameters: ReadonlyArray<string>,
    }>

export const getSourceFileMethods = (
    sourceFileText: string,
): ReadonlyArray<SourceFileMethod> => {
    const sourceFileMethods: SourceFileMethod[] = [];

    const project = new Project();

    const sourceFile = project.createSourceFile(
        'index.ts',
        sourceFileText,
    )

    sourceFile.getVariableDeclarations().forEach(
        (variableDeclaration) => {
            const arrowFunctionName = variableDeclaration.getName();

            variableDeclaration
            .getChildrenOfKind(ts.SyntaxKind.ArrowFunction)
            .forEach(
                (arrowFunction) => {
                    const parameters = arrowFunction
                        .getChildrenOfKind(ts.SyntaxKind.Parameter)
                        .map((parameter) => {
                            return parameter.getText();
                        });

                    sourceFileMethods.push({
                        kind: ts.SyntaxKind.ArrowFunction,
                        arrowFunctionName,
                        hash: `${ts.SyntaxKind.ArrowFunction}_${arrowFunctionName}`,
                        parameters,
                    })
                }
            )
        }
    )

    sourceFile.getFunctions().forEach(
        (functionDeclaration) => {
            const functionName = functionDeclaration.getName();

            if (!functionName) {
                return;
            }

            const parameters = functionDeclaration
                .getChildrenOfKind(ts.SyntaxKind.Parameter)
                .map((parameter) => parameter.getText());

            sourceFileMethods.push({
                kind: ts.SyntaxKind.FunctionDeclaration,
                functionName,
                hash: `${ts.SyntaxKind.FunctionDeclaration}_${functionName}`,
                parameters,
            })
        }
    )

    sourceFile.getClasses().forEach(
        (classDeclaration) => {
            const className = classDeclaration.getName();

            if (!className) {
                return;
            }

            classDeclaration
                .getMethods()
                .forEach(
                    (methodDeclaration) => {
                        const methodName = methodDeclaration.getName();

                        const parameters = methodDeclaration
                            .getParameters()
                            .map((parameter) => parameter.getText());

                        sourceFileMethods.push({
                            kind: ts.SyntaxKind.MethodDeclaration,
                            className,
                            methodName,
                            hash: `${ts.SyntaxKind.MethodDeclaration}_${className}_${methodName}`,
                            parameters,
                        })
                    }
                )
        }
    )

    return sourceFileMethods;
}