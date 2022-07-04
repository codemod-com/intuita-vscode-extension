import {buildReorderDeclarationsUserCommand} from "../../features/reorderDeclarations/userCommandBuilder";
import {buildReorderDeclarationFact} from "../../features/reorderDeclarations/factBuilder";
import {buildReorderDeclarationsAstCommand} from "../../features/reorderDeclarations/astCommandBuilder";
import {executeReorderDeclarationsAstCommand} from "../../features/reorderDeclarations/astCommandExecutor";
import {assert} from "chai";

describe('reorder declarations', async function() {
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

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {};export function a() {}');
    });
});