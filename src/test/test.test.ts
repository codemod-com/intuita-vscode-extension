import { getSourceFileMethods, SourceFileMethod } from "../getSourceFileMethods";

const oldSourceFileText = 'const af = (a: number) => {}; function f(a: number) {}; class C {m(a: string) {}}'
const newSourceFileText = 'const af = () => {}; function f() {}; class C {m() {}}'

export enum AstChangeKind {
    PARAMETER_DELETED = 1
}

type AstChange = Readonly<{
    kind: AstChangeKind,
    sourceFileMethod: SourceFileMethod,
    parameter: string
}>

describe('', () => {
    it('new test', () => {
        const astChanges: AstChange[] = [];

        const oldSourceFileMethods = getSourceFileMethods(oldSourceFileText);
        const newSourceFileMethods = getSourceFileMethods(newSourceFileText);

        console.log(oldSourceFileMethods);
        console.log(newSourceFileMethods);

        oldSourceFileMethods.forEach(
            (oldSfm) => {
                const newSfm = newSourceFileMethods
                    .find((newSfm) => {
                        return newSfm.hash === oldSfm.hash
                    })

                if (!newSfm) {
                    console.log('not found');
                    return;
                }

                oldSfm.parameters.forEach(
                    (parameter) => {
                        console.log(parameter)

                        if(newSfm.parameters.includes(parameter)) {
                            return;
                        }

                        console.log(parameter);

                        astChanges.push({
                            kind: AstChangeKind.PARAMETER_DELETED,
                            sourceFileMethod: oldSfm,
                            parameter,
                        })
                    }
                )
            }
        )

        console.log(astChanges);
    })
})