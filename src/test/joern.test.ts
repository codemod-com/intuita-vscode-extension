import {spawn} from "child_process";
import * as ts from 'typescript';
import {isNeitherNullNorUndefined} from "../utilities";

enum JoernCliState {
    INITIAL = 1,
    IMPORTING_CODE = 2,
}

describe.only('joern', async function() {
    this.timeout(60000);

    xit('joern', () => {
        let state: JoernCliState = JoernCliState.INITIAL;

        const spawnee = spawn('joern');

        spawnee.stdout.on('data', (data) => {
            switch (state) {
                case JoernCliState.INITIAL:
                {
                    spawnee.stdin.write(
                        `importCode.javascript(inputPath="/gppd/intuita/intuita-vscode-extension", projectName="test")\n`
                    );

                    state = JoernCliState.IMPORTING_CODE;
                    return;
                }
            }

            console.log(`stdout: ${data}`);
        });

        spawnee.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    });


    it('scanner test', () => {
        type NoraNode = Readonly<{
            node: ts.Node; // hopefully will be deprecated
            kind: ts.SyntaxKind;
            children: ReadonlyArray<NoraNode> | null;
        }>;

        const sourceCode = "export function a() {}; export class B {}";

        const mutableNodes = new Set<ts.Node>();

        function printAllChildren(node: ts.Node, depth: number) {
            console.log(new Array(depth + 1).join('----'), node.kind, node.pos, node.end);

            if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node)) {
                let mutableNode: ts.Node | null = node;

                while(mutableNode) {
                    mutableNodes.add(mutableNode);

                    mutableNode = mutableNode.parent;
                    console.log('A')
                }

                return;
            }

            if (depth === 2) {
                return;
            }

            node.getChildren().forEach(c=> {
                if (c.kind === ts.SyntaxKind.SyntaxList) {
                    // syntax list is a synthesized list
                    c.getChildren().forEach(
                        (gc) => {
                            printAllChildren(gc, depth)
                        }
                    );
                }

                printAllChildren(c, depth + 1);
            });
        }

        const sourceFile = ts.createSourceFile('foo.ts', sourceCode, ts.ScriptTarget.ES5, true);

        // printAllChildren(sourceFile, 0);

        // TODO
        const buildNoraNode = (node: ts.Node, depth: number): NoraNode => {
            if (depth === 1) {
                return {
                    kind: node.kind,
                    node,
                    children: null,
                };
            }

            const children = node
                .getChildren()
                .flatMap(childNode => {
                    if (childNode.kind === ts.SyntaxKind.SyntaxList) {
                        return childNode
                            .getChildren()
                            .map(grandChildNode => {
                                return buildNoraNode(grandChildNode, depth + 1);
                            });
                    }

                    return buildNoraNode(childNode, depth + 1);
                });

            return {
                kind: node.kind,
                node,
                children,
            };
        };

        const noraNode = buildNoraNode(sourceFile, 0);

        const indices = noraNode.children?.map(
            (childNode, index) => {
                const { node } = childNode;

                if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node)) {
                    return index;
                }

                return null;
            }
        ).filter(isNeitherNullNorUndefined);

        console.log(indices);

        const fullText = noraNode.children?.map(
            (childNode) => {
                return childNode.node.getFullText();
            }
        )?.join('');

        console.log(fullText);
    });
});