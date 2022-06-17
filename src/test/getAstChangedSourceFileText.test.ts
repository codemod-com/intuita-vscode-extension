import { assert } from "chai"
import {AstChangeApplier, } from "../getAstChangedSourceFileText"
import { getAstChanges } from "../getAstChanges"
import {Project} from "ts-morph";

const oldSourceFileText = 
`
export const x = (a: number, b: string, c: boolean) => {}

export function f(fa: number, fb: string, fc: boolean) {}

export class C {
    public cm(cma: number, cmb: string, cmc: boolean) {
    
    }
}

const y = () => {
    x(1, "2", false)
    f(1, "2", false)
    
    const c = new C();
    c.cm(1, "2", true);
}
`

const newSourceFileText = 
`
export const x = (a: number, c: boolean) => {}

export function f(fb: string, fc: boolean) {}

export class C {
    public cm(cma: number, cmb: string) {
    
    }
}

const y = () => {
    x(1, "2", false)
    f(1, "2", false)
    
    const c = new C();
    c.cm(1, "2", true);
}
`

const b =
`
import { x, f, C} from './a'

const z = () => {
    x(4, "8", true);
    f(2, "4", false);
    
    const c = new C();
    c.cm(1, "2", false);
}
`;

describe('getAstChangedSourceFileText', () => {
    it('should remove the second argument', () => {
        const astChanges = getAstChanges(
            'a.ts',
            oldSourceFileText,
            newSourceFileText,
        );

        const project = new Project({
            useInMemoryFileSystem: true,
        });

        [
            ['a.ts', newSourceFileText] as const,
            ['b.ts', b] as const,
        ].map(
            ([filePath, sourceFileText]) => {
                project.createSourceFile(
                    filePath,
                    sourceFileText,
                );
            }
        );

        const applier = new AstChangeApplier(
            project,
            astChanges,
        );

        const sourceFiles = applier.applyChanges();

        assert.equal(sourceFiles.length, 2);
        assert.isTrue(sourceFiles[0]![1]!.includes('x(1, false)'));
        assert.isTrue(sourceFiles[0]![1]!.includes('f("2", false)'));
        assert.isTrue(sourceFiles[0]![1]!.includes('c.cm(1, "2")'));

        assert.isTrue(sourceFiles[1]![1]!.includes('x(4, true)'));
        assert.isTrue(sourceFiles[1]![1]!.includes('f("4", false)'));
        assert.isTrue(sourceFiles[1]![1]!.includes('c.cm(1, "2")'));
    })
});