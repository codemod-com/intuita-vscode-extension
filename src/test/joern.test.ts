import {spawn} from "child_process";
import * as ts from 'typescript';
import {isNeitherNullNorUndefined} from "../utilities";
import {assert} from "chai";
import {buildReorderDeclarationsUserCommand} from "../features/reorderDeclarations/userCommandBuilder";
import {buildReorderDeclarationFact} from "../features/reorderDeclarations/factBuilder";
import {buildReorderDeclarationsAstCommand} from "../features/reorderDeclarations/astCommandBuilder";
import {executeReorderDeclarationsAstCommand} from "../features/reorderDeclarations/astCommandExecutor";

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
        const fileName = '/index.ts';
        const fileText = "export function a() {}; export class B {}";

        const userCommand = buildReorderDeclarationsUserCommand(
            fileName,
            fileText,
        );

        const fact = buildReorderDeclarationFact(
            userCommand,
        );

        const astCommand = buildReorderDeclarationsAstCommand(
            userCommand,
            fact,
        );

        const executions = executeReorderDeclarationsAstCommand(astCommand);

        console.log(executions);
    });
});