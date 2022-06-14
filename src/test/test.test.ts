import { Node, Project } from "ts-morph"
import { AstChangeKind, getAstChanges } from "../getAstChanges"

const oldSourceFileText = 
`
const x = (a: number, b: string, c: boolean) => {}

const y = () => {
    x(1, "2", false)
}
`

const newSourceFileText = 
`
const x = (a: number, c: boolean) => {}

const y = () => {
    x(1, "2", false)
}
`

describe.only('x', () => {
    it('y', () => {
        const astChanges = getAstChanges(
            oldSourceFileText,
            newSourceFileText,
        )

        console.log(astChanges);

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

                const referencedSymbols = variableDeclaration.findReferences();

                for (const referencedSymbol of referencedSymbols) {
                    for (const reference of referencedSymbol.getReferences()) {
                        const parentNode = reference.getNode().getParent()

                        if (!Node.isCallExpression(parentNode)) {
                            continue;
                        }

                        const argument = parentNode.getArguments()[index];

                        if (!argument) {
                            continue;
                        }

                        parentNode.removeArgument(argument);
                    }
                }
            }
        )

        console.log(sourceFile.getFullText())
    })
})