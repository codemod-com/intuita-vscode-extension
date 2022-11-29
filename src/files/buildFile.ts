import type { Uri } from 'vscode';
import { calculateLengths, calculateLines, getSeparator } from '../utilities';
import type { File } from './types';

export const buildFile = (uri: Uri, text: string, version: number): File => {
	const separator = getSeparator(text);
	const lines = calculateLines(text, separator);
	const lengths = calculateLengths(lines);

	return {
		uri,
		text,
		version,
		separator,
		lines,
		lengths
	};
};
