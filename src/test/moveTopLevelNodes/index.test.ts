import {assert} from "chai";
import {moveTopLevelNode} from "../../features/moveTopLevelNode";

describe('move top-level nodes', async function() {
    const fileText = [
        "export function a() { return new B(); };",
        "export function c() {};",
        "export class B {};",
    ].join('\n');

    it('should move A nowhere', () => {
        const fileName = '/index.ts';

        const fileLine = 0;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 0);
    });

    it('should move C before A', () => {
        const fileName = '/index.ts';

        const fileLine = 1;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 1);
        assert.equal(
            executions[0]?.text,
            [
                "export function c() {};",
                "export function a() { return new B(); };",
                "export class B {};",
            ].join('\n')
        );
    });

    it('should move B before A', () => {
        const fileName = '/index.ts';

        const fileLine = 2;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(
            executions[0]?.text,
            [
                "export class B {};",
                "export function a() { return new B(); };",
                "export function c() {};",
            ].join('\n')
        );
    });
});

describe('move top-level nodes for TS with comments', async function() {
    const fileText = [
        "/** comment **/",
        "export function a() { return new B(); }; /** commentA **/",
        "// comment",
        "export function c() {}; // commentC",
        "/** comment\ncomment2 **/",
        "export class B {}; // commentB",
    ].join('\n');

    it('should move A nowhere', () => {
        const fileName = '/index.ts';

        const fileLine = 1;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 0);
    });

    it('should move C before A', () => {
        const fileName = '/index.ts';

        const fileLine = 3;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 1);
        assert.equal(
            executions[0]?.text,
            [
                "// comment",
                "export function c() {}; // commentC",
                "/** comment **/",
                "export function a() { return new B(); }; /** commentA **/",
                "/** comment\ncomment2 **/",
                "export class B {}; // commentB",
            ].join('\n')
        );
    });

    it('should move B before A', () => {
        const fileName = '/index.ts';

        const fileLine = 5;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 1);
        assert.equal(executions[0]?.name, '/index.ts');
        assert.equal(
            executions[0]?.text,
            [
                "/** comment\ncomment2 **/",
                "export class B {}; // commentB",
                "/** comment **/",
                "export function a() { return new B(); }; /** commentA **/",
                "// comment",
                "export function c() {}; // commentC",
            ].join('\n')
        );
    });
});

describe('move top-level nodes for Java', async function() {
    const fileText = [
        "package var.var.sealed;",
        "/** comment **/",
        "public class A { void a() { return new B(); } }",
        "interface C {}",
        "class B {}",
    ].join('\n');

    const fileName = '/A.java';

    it('should move A after B', () => {
        const fileLine = 2;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 1);
        assert.equal(
            executions[0]?.text,
            [
                "package var.var.sealed;",
                "interface C {}",
                "/** comment **/",
                "public class A { void a() { return new B(); } }",
                "class B {}",
            ].join('\n')
        );
    });

    it('should move C before A', () => {
        const fileLine = 3;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 1);
        assert.equal(
            executions[0]?.text,
            [
                "package var.var.sealed;",
                "interface C {}",
                "/** comment **/",
                "public class A { void a() { return new B(); } }",
                "class B {}",
            ].join('\n')
        );
    });

    it('should move B before A', () => {
        const fileLine = 4;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 1);
        assert.equal(
            executions[0]?.text,
            [
                "package var.var.sealed;",
                "class B {}",
                "/** comment **/",
                "public class A { void a() { return new B(); } }",
                "interface C {}",
            ].join('\n')
        );
    });
});