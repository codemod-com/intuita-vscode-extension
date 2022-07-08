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

describe('move top-level nodes for Java', async function() {
    const fileText = [
        "export class A { void a() { return new B(); } }",
        "class C() {}",
        "class B {}",
    ].join('\n');

    it('should move A nowhere', () => {
        const fileName = '/A.java';

        const fileLine = 0;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        assert.equal(executions.length, 0);
    });
});