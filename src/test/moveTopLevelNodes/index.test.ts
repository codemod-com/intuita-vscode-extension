import {assert} from "chai";
import {reorderDeclarations} from "../../features/reorderDeclarations";
import {moveTopLevelNode} from "../../features/moveTopLevelNode";

describe('move top-level nodes', async function() {
    it('reorder a function and a class', () => {
        const fileName = '/index.ts';
        const fileText = [
            "export function a() { return new B(); };",
            "export function c() {};",
            "export class B {};",
        ].join('\n');
        const fileLine = 2;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
        );

        // assert.equal(executions.length, 1);
        // assert.equal(executions[0]?.name, '/index.ts');
        // assert.equal(
        //     executions[0]?.text,
        //     [
        //         "",
        //         "export function c() {};",
        //         "export class B {};export function a() { return new B(); }",
        //     ].join('\n'),
        // );
    })
});