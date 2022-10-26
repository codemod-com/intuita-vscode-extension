import { createSourceFile, ScriptTarget } from 'typescript';
import type { Uri } from 'vscode';
import { getScriptKind } from '../features/moveTopLevelNode/2_factBuilders/typeScriptFactBuilder';
import { calculateLengths, calculateLines, getSeparator } from '../utilities';
import type { File } from './types';

export const buildFile = (uri: Uri, text: string, version: number): File => {
	const stringUri = uri.toString();

	const separator = getSeparator(text);
	const lines = calculateLines(text, separator);
	const lengths = calculateLengths(lines);

	const scriptKind = getScriptKind(stringUri);

	const sourceFile = createSourceFile(
		'index.ts',
		text,
		ScriptTarget.Latest,
		true,
		scriptKind ?? undefined,
	);

	return {
		uri,
		text,
		version,
		separator,
		lines,
		lengths,
		sourceFile,
	};
};
