import { AstChangeKind, getAstChanges } from "../getAstChanges";
import { assert } from 'chai';

const oldSourceFileText = 'const af = (a: number) => {}; function f(b: number) {}; class C {m(c: string) {}}'
const newSourceFileText = 'const af = () => {}; function f() {}; class C {m() {}}'

describe('getAstChanges', () => {
    it('should find AST changes for parameter removal', () => {
        const astChanges = getAstChanges(
            oldSourceFileText,
            newSourceFileText,
        )

        assert.deepEqual(
            astChanges,
            [
                {
                    kind: AstChangeKind.ARROW_FUNCTION_PARAMETER_DELETED,
                    arrowFunctionName: 'af',
                    parameter: 'a'
                },
                {
                    kind: AstChangeKind.FUNCTION_PARAMETER_DELETED,
                    functionName: 'f',
                    parameter: 'b'
                },
                {
                    kind: AstChangeKind.CLASS_METHOD_PARAMETER_DELETED,
                    className: 'C',
                    methodName: 'm',
                    parameter: 'c'
                }
            ]
        );
    })
})