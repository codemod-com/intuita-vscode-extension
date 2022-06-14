import { Node, Project } from "ts-morph";
import { AstChange, AstChangeKind } from "./getAstChanges";

export const getAstChangedSourceFileText = (
    astChanges: ReadonlyArray<AstChange>,
    newSourceFileText: string,
) => {
    const project = new Project({ useInMemoryFileSystem: true });

    const sourceFile = project.createSourceFile(
        'index.ts',
        newSourceFileText,
    )

    astChanges.forEach(
        (astChange) => {
            if (astChange.kind !== AstChangeKind.ARROW_FUNCTION_PARAMETER_DELETED) {
                return;
            }

            const index = astChange.parameters.findIndex(p => p === astChange.parameter);

            if (index === -1) {
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
                        const parentNode = reference.getNode().getParent()

                        if (!Node.isCallExpression(parentNode)) {
                            return;
                        }

                        const argument = parentNode.getArguments()[index];

                        if (!argument) {
                            return;
                        }

                        parentNode.removeArgument(argument);
                    }
                )
        }
    )

    return sourceFile.getFullText();
}