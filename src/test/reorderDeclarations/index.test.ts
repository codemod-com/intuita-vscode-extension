import {assert} from "chai";
import {reorderDeclarations} from "../../features/reorderDeclarations";

describe('reorder declarations', async function() {
    it('reorder a function and a class', () => {
        const fileName = '/index.ts';
        const fileText = [
            "export function a() { return new B(); };",
            "export function c() {};",
            "export class B {}",
        ].join('\n');

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(
            executions[0]?.text,
            [
                "",
                "export function c() {};",
                "export class B {};export function a() { return new B(); }",
            ].join('\n'),
        );
    });

    it('reorder a interface and a class', () => {
        const fileName = '/index.ts';
        const fileText = [
            "export interface A {}",
            "export class B {}",
            "export function c() {};",
            "export function d() { const a: A  = {}; };",
        ].join('\n');

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(
            executions[0]?.text,
            [
                'export interface A {}',
                'export function d() { const a: A  = {}; }',
                'export class B {};',
                'export function c() {};'
            ].join('\n')
        );
    });

    it('reorder a block and a class', () => {
        const fileName = '/index.ts';
        const fileText = [
            "{ const b = new B(); };",
            "export class A {};",
            "export class B {};"
        ].join('\n');

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(
            executions[0]?.text,
            [
                "",
                "export class A {};",
                "export class B {};{ const b = new B(); };",
            ].join('\n'),
        );
    });

    it('reorder a type (alias) and a class', () => {
        const fileName = '/index.ts';
        const fileText = [
            "export type A = string | number;",
            "export class B {}",
            "export type C = A | boolean;"
        ].join('\n');

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(
            executions[0]?.text,
            [
                "export type A = string | number;",
                "export type C = A | boolean;",
                "export class B {}"
            ].join("\n")
        );
    });

    it('reorder a variable statement and a class', () => {
        const fileName = '/index.ts';
        const fileText = [
            "export const a = () => {};",
            "export class B {}",
            "export const c = () => { a() };"
        ].join('\n');

        const executions = reorderDeclarations(fileName, fileText);

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(
            executions[0]?.text,
            [
                "export const a = () => {};",
                "export const c = () => { a() };",
                "export class B {}",
            ].join('\n'),
        );
    });
});