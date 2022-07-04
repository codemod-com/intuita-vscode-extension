import {spawn} from "child_process";
import * as ts from 'typescript';
import {isNeitherNullNorUndefined} from "../utilities";
import {assert} from "chai";

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
        type NoraNode =
            | Readonly<{
                children: ReadonlyArray<NoraNode>;
            }>
            | Readonly<{
                node: ts.Node,
            }>;

        const sourceCode = "export function a() {}; export class B {}";

        const sourceFile = ts.createSourceFile('foo.ts', sourceCode, ts.ScriptTarget.ES5, true);

        const buildNoraNode = (node: ts.Node, depth: number): NoraNode => {
            if (depth === 1) {
                return {
                    node,
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
                children,
            };
        };

        const noraNode = buildNoraNode(sourceFile, 0);

        const indices: ReadonlyArray<number> = 'children' in noraNode && noraNode.children.map(
            (childNode, index) => {
                if (!('node' in childNode)) {
                    return null;
                }

                const { node } = childNode;

                if (ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node)) {
                    return index;
                }

                return null;
            }
        ).filter(isNeitherNullNorUndefined) || [];

        console.log(indices);

        const getNoraNodeFullText = (noraNode: NoraNode): string => {
            if ('node' in noraNode) {
                return noraNode.node.getFullText();
            }

            return noraNode
                .children
                .map(
                    (childNode) => getNoraNodeFullText(childNode)
                )
                .join('');
        };

        const fullText = getNoraNodeFullText(noraNode);

        assert.equal(fullText, sourceCode);

        const replaceChildrenOrder = (
            noraNode: NoraNode,
            replacementMap: Map<number, number>,
        ): NoraNode => {
            if (!('children' in noraNode)) {
                return noraNode;
            }

            const children = noraNode.children.slice();

            replacementMap.forEach(
                (value, key) => {
                    children[key] = noraNode.children[value]!;
                }
            );

            return {
                ...noraNode,
                children,
            };
        };

        const replacementMap = new Map<number, number>(
            [
                [0, 2],
                [2, 0],
            ],
        );

        const newNoraNode = replaceChildrenOrder(noraNode, replacementMap);

        const x = getNoraNodeFullText(newNoraNode);

        console.log(x);
    });
});