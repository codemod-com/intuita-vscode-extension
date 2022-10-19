import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CaseKind, ClassifierDiagnostic } from '../../classifier/types';
import { classify } from '../../classifier/classify';
import { assertsNeitherNullOrUndefined } from '../../utilities';
import { assert } from 'chai';

describe.only('Classifier', () => {
	it('should classify correctly', () => {
		const text = readFileSync(join(__dirname, './code.txt')).toString(
			'utf8',
		);

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
			return {
				code: entry.code,
				message: entry.message,
				range: [
					entry.startLineNumber,
					entry.startColumnNumber,
					entry.endLineNumber,
					entry.endColumnNumber,
				],
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
			replacementRange: [0, 0, 0, 0],
		});

		assert.deepEqual(classifiers[1], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: [0, 0, 0, 0],
		});

		assert.deepEqual(classifiers[2], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: [0, 0, 0, 0],
		});

		assert.deepEqual(classifiers[3], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: [0, 0, 0, 0],
		});

		assert.deepEqual(classifiers[4], {
			kind: CaseKind.TS2369_OBJECT_ASSIGN,
			replacementRange: [0, 0, 0, 0],
		});
	});
});
