import {readFileSync} from "fs";
import {join} from "path";
import {getAstChanges} from "../getAstChanges";
import {Project} from "ts-morph";
import {AstChangeApplier} from "../astChangeApplier";

export const applyChanges = (directoryPath: string) => {
    const sourceFileText1 = readFileSync(join(directoryPath, 'sourceFileText1.ts'), 'utf8');
    const sourceFileText2 = readFileSync(join(directoryPath, 'sourceFileText2.ts'), 'utf8');
    const sourceFileText3 = readFileSync(join(directoryPath, 'sourceFileText3.ts'), 'utf8');

    const astChanges = getAstChanges(
        'index.ts',
        sourceFileText1,
        sourceFileText2,
    );

    const project = new Project({
        useInMemoryFileSystem: true,
    });
    [
        ['index.ts', sourceFileText2] as const,
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

    return {
        sourceFiles,
        sourceFileText3,
    };
}