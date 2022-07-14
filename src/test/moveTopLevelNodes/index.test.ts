import {assert} from "chai";
import {moveTopLevelNode} from "../../features/moveTopLevelNode";
import {readFileSync} from "fs";
import {join} from "path";

describe('move top-level nodes for TS', async function() {
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
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
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
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
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
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
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

describe('move top-level nodes for TS (real files)', function() {
    const fileName = '/index.ts';

    const fileText = readFileSync(
        join(
            __dirname,
            './typeScript/manipulationSettingsContainerOriginal.txt'
        ),
        'utf8'
    );

    it ('should not move the 0th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            5,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 0,
                kindCoefficientWeight: 0,
            },
        );

        assert.equal(executions.length, 0);
    });

    it('should move the 1th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            20,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
        );

        assert.equal(executions.length, 1);

        const newFileText = readFileSync(
            join(
                __dirname,
                './typeScript/manipulationSettingsContainer20.txt'
            ),
            'utf8'
        );

        assert.equal(
            executions[0]?.text,
            newFileText
        );
    });

    it ('should move the 2th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            41,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 0,
            },
        );

        assert.equal(executions.length, 1);

        const newFileText = readFileSync(
            join(
                __dirname,
                './typeScript/manipulationSettingsContainer41.txt'
            ),
            'utf8'
        );

        assert.equal(
            executions[0]?.text,
            newFileText
        );
    });

    it('should move the 3th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            47,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
        );

        assert.equal(executions.length, 1);

        const newFileText = readFileSync(
            join(
                __dirname,
                './typeScript/manipulationSettingsContainer47.txt'
            ),
            'utf8'
        );

        assert.equal(
            executions[0]?.text,
            newFileText
        );
    });

    it('should not move the 4th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            60,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
        );

        assert.equal(executions.length, 1);
    });
});

describe('move top-level nodes for TSX (real files)', function() {
    const fileName = '/index.ts';

    const fileText = readFileSync(
        join(
            __dirname,
            './typeScript/entityExplorerOriginal.txt'
        ),
        'utf8'
    );

    it ('should not move the 0th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            33,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 0,
            },
        );

        assert.equal(executions.length, 1);

        const newFileText = readFileSync(
            join(
                __dirname,
                './typeScript/entityExplorer33.txt'
            ),
            'utf8'
        );

        assert.equal(
            executions[0]?.text,
            newFileText
        );
    });
});

describe('move top-level nodes for JS (real files)', function() {
    const fileName = '/index.js';

    const fileText = readFileSync(
        join(
            __dirname,
            './javaScript/resizeImageWidth.txt'
        ),
        'utf8'
    );

    it ('should not move the 0th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            5,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
        );

        assert.equal(executions.length, 0);
    });

    it ('should move the 1th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            64,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 0,
                kindCoefficientWeight: 0,
            },
        );

        assert.equal(executions.length, 1);
    });

    it ('should move the 2th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            92,
            {
                dependencyCoefficientWeight: 0,
                similarityCoefficientWeight: 0,
                kindCoefficientWeight: 1,
            },
        );

        assert.equal(executions.length, 1);
    });

    it ('should move the 3th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            117,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 0,
                kindCoefficientWeight: 0,
            },
        );

        assert.equal(executions.length, 1);
    });

    it ('should move the 4th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            203,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 0,
                kindCoefficientWeight: 0,
            },
        );

        assert.equal(executions.length, 1);
    });
});

describe('move top-level nodes for TS with comments', async function() {
    const fileText = [
        "/** comment **/",
        "export function a() { return new B(); }; /** commentA **/",
        "",
        "// comment",
        "export function c() {}; // commentC",
        "",
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
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
        );

        assert.equal(executions.length, 0);
    });

    it('should move C before A', () => {
        const fileName = '/index.ts';

        const fileLine = 4;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
        );

        assert.equal(executions.length, 1);
        assert.equal(
            executions[0]?.text,
            [
                "// comment",
                "export function c() {}; // commentC",
                "",
                "/** comment **/",
                "export function a() { return new B(); }; /** commentA **/",
                "",
                "/** comment\ncomment2 **/",
                "export class B {}; // commentB",
            ].join('\n')
        );
    });

    it('should move B before A', () => {
        const fileName = '/index.ts';

        const fileLine = 7;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
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
                "",
                "// comment",
                "export function c() {}; // commentC",
                "",
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
        const fileLine = 3;

        const executions = moveTopLevelNode(
            fileName,
            fileText,
            fileLine,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
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
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
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
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
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

describe('move top-level nodes for C (real files)', function() {
    const fileName = '/adfs_inode.c';

    const fileText = readFileSync(
        join(
            __dirname,
            './c/adfs_inode.txt'
        ),
        'utf8'
    );

    it ('should not move the 0th node', function() {
        const executions = moveTopLevelNode(
            fileName,
            fileText,
            11,
            {
                dependencyCoefficientWeight: 1,
                similarityCoefficientWeight: 1,
                kindCoefficientWeight: 1,
            },
        );

        assert.equal(executions.length, 0);
    });
})