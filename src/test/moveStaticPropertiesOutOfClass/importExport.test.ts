import {Project} from "ts-morph";
import {AstChangeApplier} from "../../astChangeApplier";
import {AstChangeKind} from "../../getAstChanges";
import {assert} from "chai";

const a_ts =
`
export class A {
    static a = 1;
}
`;

const b_ts =
`
import { A } from './a';
console.log(A.a);
`;

describe('move static properties out of class - import/export', () => {
    it('should provide proper imports and exports', () => {
        const project = new Project({
            useInMemoryFileSystem: true,
        });

        project.createSourceFile(
            'a.ts',
            a_ts,
        );

        project.createSourceFile(
            'b.ts',
            b_ts,
        );

        const applier = new AstChangeApplier(
            project,
            [
                {
                    kind: AstChangeKind.CLASS_SPLIT_COMMAND,
                    filePath: 'a.ts',
                    className: 'A',
                }
            ],
        );

        const sourceFiles = applier.applyChanges();

        assert.equal(sourceFiles.length, 2);

        assert.equal(sourceFiles[0]![0], '/b.ts');
        assert.equal(sourceFiles[0]![1], 'import { a } from \"./a\";\n\nconsole.log(a);\n');

        assert.equal(sourceFiles[1]![0], '/a.ts');
        assert.equal(sourceFiles[1]![1], 'export let a = 1;\n');
    });
});