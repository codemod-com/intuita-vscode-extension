import { ts } from "ts-morph";
import { getAstChanges } from "../getAstChanges";

const oldSourceFileText = 'const af = (a: number) => {}; function f(b: number) {}; class C {m(c: string) {}}'
const newSourceFileText = 'const af = () => {}; function f() {}; class C {m() {}}'

describe('', () => {
    it('new test', () => {
        const astChange = getAstChanges(
            oldSourceFileText,
            newSourceFileText,
        )

        console.log(astChange);
    })
})