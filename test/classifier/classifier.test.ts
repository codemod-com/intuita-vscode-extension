import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { join } from 'path';
import { assert } from 'chai';
import { CaseKind } from '../../src/cases/types';
import { classify } from '../../src/classifier/classify';
import { ClassifierDiagnostic } from '../../src/classifier/types';
import {
	getSeparator,
	calculateLines,
	calculateLengths,
	buildIntuitaSimpleRange,
	assertsNeitherNullOrUndefined,
} from '../../src/utilities';
import { Entry } from '../entry';

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

		const entries: ReadonlyArray<Entry> = JSON.parse(
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

		assert.equal(classifiers[0].kind, CaseKind.TS2769_OBJECT_ASSIGN);
		assert.equal(classifiers[1].kind, CaseKind.TS2769_OBJECT_ASSIGN);
		assert.equal(classifiers[2].kind, CaseKind.TS2769_OBJECT_ASSIGN);
		assert.equal(classifiers[3].kind, CaseKind.TS2769_OBJECT_ASSIGN);
		assert.equal(classifiers[4].kind, CaseKind.TS2769_OBJECT_ASSIGN);

		assert.deepEqual(classifiers[0].node.getStart(), 175);
		assert.deepEqual(classifiers[0].node.getEnd(), 198);

		assert.deepEqual(classifiers[1].node.getStart(), 201);
		assert.deepEqual(classifiers[1].node.getEnd(), 224);

		assert.deepEqual(classifiers[2].node.getStart(), 226);
		assert.deepEqual(classifiers[2].node.getEnd(), 246);

		assert.deepEqual(classifiers[3].node.getStart(), 248);
		assert.deepEqual(classifiers[3].node.getEnd(), 271);

		assert.deepEqual(classifiers[4].node.getStart(), 273);
		assert.deepEqual(classifiers[4].node.getEnd(), 296);
	});
});
