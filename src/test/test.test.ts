import { ts, Project } from "ts-morph";

const a = 'const x = (a: number) => {}; function y(a: number) {}'
// const b = `const x = () => {}`;

type SourceFileMethod = Readonly<{
    kind: ts.SyntaxKind,
    name: string,
    parameters: ReadonlyArray<string>,
}>;

describe('', () => {
    console.log('T');

    it('new test', () => {
        const sourceFileMethods: SourceFileMethod[] = [];

        const project = new Project();

        const sf = project.createSourceFile(
            'index.ts',
            a
        )

        sf.getVariableDeclarations().forEach(
            (variableDeclaration) => {
                const name = variableDeclaration.getName();

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
                            name,
                            parameters,
                        })
                    }
                )
            }
        )

        sf.getFunctions().forEach(
            (functionDeclaration) => {
                const name = functionDeclaration.getName();

                if (!name) {
                    return;
                }

                const parameters = functionDeclaration
                    .getChildrenOfKind(ts.SyntaxKind.Parameter)
                    .map((parameter) => {
                        return parameter.getText();
                    });

                sourceFileMethods.push({
                    kind: ts.SyntaxKind.Parameter,
                    name,
                    parameters,
                })
            }
        )

        console.log(sourceFileMethods);
    })

    xit('test', () => {
        const sourceFile = ts.createSourceFile(
            'index.ts',
            a,
            ts.ScriptTarget.Latest,
        )

        const callback = (node: ts.Node, level: number, sibling: number) => {
            console.log({
                l: level,
                s: sibling,
                p1: node.pos,
                e1: node.end,
                kind: node.kind
            });
    
            let s = 0;

            ts.forEachChild(
                node,
                (childNode) => {
                    callback(childNode, level+1, s);
                    ++s;
                }
            )
        }

        callback(sourceFile, 0, 0);
    })
})