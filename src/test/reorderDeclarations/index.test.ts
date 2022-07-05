import {assert} from "chai";
import {reorderDeclarations} from "../../features/reorderDeclarations";

describe('reorder declarations', async function() {
    it('reorder a function and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export function a() {}; export class B {}";

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {};export function a() {}');
    });

    it('reorder a interface and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export interface A {}; export class B {}";

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {};export interface A {}');
    });

    it('reorder a block and a class', () => {
        const fileName = '/index.ts';
        const fileText = "{ const x = 1; }; export class B {}";

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {};{ const x = 1; }');
    });

    it('reorder a type (alias) and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export type A = string | number; export class B {}";

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {}export type A = string | number;');
    });

    it('reorder a variable statement and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export const a = () => {}; export class B {}";

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {}export const a = () => {};');
    });

    it('reorder a variable statement and a class', () => {
        const fileName = '/index.ts';
        const fileText = "export const a = () => { const b = new B(); }; export class B {}";

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(executions[0]?.text, ' export class B {}export const a = () => { const b = new B(); };');
    });
});