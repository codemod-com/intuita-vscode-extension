import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CaseKind, ClassifierDiagnostic } from '../../classifier/types';
import { classify } from '../../classifier/classify';
import {
	assertsNeitherNullOrUndefined,
	buildIntuitaSimpleRange,
	calculateLengths,
	calculateLines,
	getSeparator,
} from '../../utilities';
import { assert } from 'chai';

describe('Classifier', () => {
	it('should classify correctly', () => {
		const text = readFileSync(join(__dirname, './code.txt')).toString(
			'utf8',
		);

		const separator = getSeparator(text);
		const lines = calculateLines(text, separator);
		const lengths = calculateLengths(lines);

		const sourceFile = ts.createSourceFile(
			'index.ts',
			text,
			ts.ScriptTarget.ES5,
			true,
			ts.ScriptKind.TS,
		);

		const entries: any[] = JSON.parse(
			readFileSync(join(__dirname, './diagnostics.txt')).toString('utf8'),
		);

		const diagnostics = entries.map((entry): ClassifierDiagnostic => {
			const range = buildIntuitaSimpleRange(separator, lengths, [
				entry.startLineNumber - 1,
				entry.startColumn - 1,
				entry.endLineNumber - 1,
				entry.endColumn - 1,
			]);

			return {
				code: String(entry.code),
				message: entry.message,
				range,
			};
		});

		const classifiers = diagnostics.map((diagnostic) =>
			classify(sourceFile, diagnostic),
		);

		assertsNeitherNullOrUndefined(classifiers[0]);
		assertsNeitherNullOrUndefined(classifiers[1]);
		assertsNeitherNullOrUndefined(classifiers[2]);
		assertsNeitherNullOrUndefined(classifiers[3]);
		assertsNeitherNullOrUndefined(classifiers[4]);

		assert.deepEqual(classifiers[0], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: {
				start: 173,
				end: 198,
			},
		});

		assert.deepEqual(classifiers[1], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: {
					start: 199,
					end: 224,
				},
		});

		assert.deepEqual(classifiers[2], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: {
					start: 224,
					end: 246,
				}
		});

		assert.deepEqual(classifiers[3], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: {
					start: 246,
					end: 271,
				}
		});

		assert.deepEqual(classifiers[4], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: {
					start: 271,
					end: 296,
				}
		});
	});
});
