import * as ts from 'typescript';
import { CaseKind, Classification, ClassifierDiagnostic } from './types';

export const classify = (
	sourceFile: ts.SourceFile,
	diagnostic: ClassifierDiagnostic,
): Classification => {
    

	return {
		kind: CaseKind.OTHER,
		replacementRange: diagnostic.range,
	};
};
