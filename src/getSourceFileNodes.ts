import {ts, Project, Node} from "ts-morph";

export type SourceFileNode =
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
        static: boolean,
    }>
    | Readonly<{
        kind: ts.SyntaxKind.ClassDeclaration,
        className: string,
        hash: string,
        toSplit: boolean;
        maxGroupCount: 2 | null,
    }>;

export const isExtendedMethodDeclaration = (node: SourceFileNode): node is SourceFileNode & {
    kind: ts.SyntaxKind.ArrowFunction | ts.SyntaxKind.FunctionDeclaration | ts.SyntaxKind.MethodDeclaration
} =>
    node.kind === ts.SyntaxKind.ArrowFunction
    || node.kind === ts.SyntaxKind.FunctionDeclaration
    || node.kind === ts.SyntaxKind.MethodDeclaration;

export const isClassDeclaration = (node: SourceFileNode): node is SourceFileNode & {
    kind: ts.SyntaxKind.ClassDeclaration
} =>
    node.kind === ts.SyntaxKind.ClassDeclaration;

export const getSourceFileNodes = (
    sourceFileText: string,
): ReadonlyArray<SourceFileNode> => {
    const sourceFileNodes: SourceFileNode[] = [];

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
                        .map((parameter) => parameter.getName());

                    sourceFileNodes.push({
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
                .map((parameter) => parameter.getName());

            sourceFileNodes.push({
                kind: ts.SyntaxKind.FunctionDeclaration,
                functionName,
                hash: `${ts.SyntaxKind.FunctionDeclaration}_${functionName}`,
                parameters,
            });
        }
    );

    const classesToSplit = new Set<string>();
    const maxGroupCountMap = new Map<string, 2 | null>();

    sourceFile.getStatementsWithComments().forEach((statement) => {
        if (!Node.isCommentStatement(statement)) {
            return;
        }

        const text = statement.getText()

        if(!text.includes('split')) {
            return;
        }

        const nextSibling = statement.getNextSibling();

        if (!Node.isClassDeclaration(nextSibling)) {
            return;
        }

        const name = nextSibling.getName();

        if (!name) {
            return;
        }

        classesToSplit.add(name);

        maxGroupCountMap.set(
            name,
            text.includes('split 2') ? 2 : null,
        );
    });

    sourceFile.getClasses().forEach(
        (classDeclaration) => {
            const className = classDeclaration.getName();

            if (!className) {
                return;
            }

            sourceFileNodes.push({
                kind: ts.SyntaxKind.ClassDeclaration,
                className,
                hash: `${ts.SyntaxKind.ClassDeclaration}_${className}`,
                toSplit: classesToSplit.has(className),
                maxGroupCount: maxGroupCountMap.get(className) ?? null,
            });

            classDeclaration
                .getInstanceMethods()
                .forEach(
                    (methodDeclaration) => {
                        const methodName = methodDeclaration.getName();

                        const parameters = methodDeclaration
                            .getParameters()
                            .map((parameter) => parameter.getName());

                        sourceFileNodes.push({
                            kind: ts.SyntaxKind.MethodDeclaration,
                            className,
                            methodName,
                            hash: `${ts.SyntaxKind.MethodDeclaration}_${className}_${methodName}`,
                            parameters,
                            static: false,
                        })
                    }
                )

            classDeclaration
                .getStaticMethods()
                .forEach(
                    (methodDeclaration) => {
                        const methodName = methodDeclaration.getName();

                        const parameters = methodDeclaration
                            .getParameters()
                            .map((parameter) => parameter.getName());

                        sourceFileNodes.push({
                            kind: ts.SyntaxKind.MethodDeclaration,
                            className,
                            methodName,
                            hash: `${ts.SyntaxKind.MethodDeclaration}_${className}_${methodName}`,
                            parameters,
                            static: true,
                        })
                    }
                )
        }
    )

    return sourceFileNodes;
}