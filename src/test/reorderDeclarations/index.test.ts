import {buildReorderDeclarationsUserCommand} from "../../features/reorderDeclarations/userCommandBuilder";
import {buildReorderDeclarationFact} from "../../features/reorderDeclarations/factBuilder";
import {buildReorderDeclarationsAstCommand} from "../../features/reorderDeclarations/astCommandBuilder";
import {executeReorderDeclarationsAstCommand} from "../../features/reorderDeclarations/astCommandExecutor";
import {assert} from "chai";

describe('reorder declarations', async function() {
    const execute = (
        fileName: string,
        fileText: string,
    ) => {
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

        return executeReorderDeclarationsAstCommand(astCommand);
    };

    it('reorder a function and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export function a() {}; export class B {}";

        const executions = execute(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {};export function a() {}');
    });

    it('reorder a interface and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export interface A {}; export class B {}";

        const executions = execute(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {};export interface A {}');
    });

    it('reorder a block and a class', () => {
        const fileName = '/index.ts';
        const fileText = "{ const x = 1; }; export class B {}";

        const executions = execute(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {};{ const x = 1; }');
    });

    it('reorder a type (alias) and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export type A = string | number; export class B {}";

        const executions = execute(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {}export type A = string | number;');
    });

    it('reorder a variable statement and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export const a = () => {}; export class B {}";

        const executions = execute(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {}export const a = () => {};');
    });
});