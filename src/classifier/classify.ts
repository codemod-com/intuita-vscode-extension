import * as ts from 'typescript';
import { CaseKind, Classification, ClassifierDiagnostic } from './types';

export const classify = (
	sourceFile: ts.SourceFile,
	diagnostic: ClassifierDiagnostic,
): Classification => {
    sourceFile;
    // sourceFile.forEachChild(
    //     (node) => {
    //         const start = node.getFullStart()
    //         const end = node.getEnd()

    //         node.getChildren()
    //     }
    // )

	return {
		kind: CaseKind.OTHER,
		replacementRange: diagnostic.range,
	};
};
