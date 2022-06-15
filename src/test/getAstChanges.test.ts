import { AstChangeKind, getAstChanges } from "../getAstChanges";
import { assert } from 'chai';

const oldSourceFileText = 'const af = (a: number) => {}; function f(b: number) {}; class C {m(c: string) {}}'
const newSourceFileText = 'const af = () => {}; function f() {}; class C {m() {}}'

describe('getAstChanges', () => {
    it('should find AST changes for parameter removal', () => {
        const filePath = 'index.ts'

        const astChanges = getAstChanges(
            filePath,
            oldSourceFileText,
            newSourceFileText,
        )

        assert.deepEqual(
            astChanges,
            [
                {
                    kind: AstChangeKind.ARROW_FUNCTION_PARAMETER_DELETED,
                    filePath,
                    arrowFunctionName: 'af',
                    parameter: 'a',
                    parameters: ['a'],
                },
                {
                    kind: AstChangeKind.FUNCTION_PARAMETER_DELETED,
                    filePath,
                    functionName: 'f',
                    parameter: 'b',
                    parameters: ['b'],
                },
                {
                    kind: AstChangeKind.CLASS_METHOD_PARAMETER_DELETED,
                    filePath,
                    className: 'C',
                    methodName: 'm',
                    parameter: 'c',
                    parameters: ['c'],
                }
            ]
        );
    })
})