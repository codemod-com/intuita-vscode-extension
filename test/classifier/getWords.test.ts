import * as ts from 'typescript';
import { assert } from 'chai';
import { calculateSimilarity } from '../../src/classifier/similarity';

describe('calculateCosineSimilarity', () => {
	it('should calculate correct similarity for two Object.assign() statements', () => {
		const leftSourceFile = ts.createSourceFile(
			'index.ts',
			`Object.assign({ a: 1 }, test1)`,
			ts.ScriptTarget.ES5,
			true,
			ts.ScriptKind.TS,
		);

		const rightSourceFile = ts.createSourceFile(
			'index.ts',
			`Object.assign({ b: 1 }, test2)`,
			ts.ScriptTarget.ES5,
			true,
			ts.ScriptKind.TS,
		);

		const similarity = calculateSimilarity(leftSourceFile, rightSourceFile);

		assert.approximately(similarity, 0.91, 0.01);
	});

	it('should calculate correct similarity for an Object.assign() vs a function statements', () => {
		const leftSourceFile = ts.createSourceFile(
			'index.ts',
			`Object.assign({ a: 1 }, test1)`,
			ts.ScriptTarget.ES5,
			true,
			ts.ScriptKind.TS,
		);

		const rightSourceFile = ts.createSourceFile(
			'index.ts',
			`function a() { return 1 }`,
			ts.ScriptTarget.ES5,
			true,
			ts.ScriptKind.TS,
		);

		const similarity = calculateSimilarity(leftSourceFile, rightSourceFile);

		assert.approximately(similarity, 0.21, 0.01);
	});

	it('should calculate correct similarity for two functions statement', () => {
		const leftSourceFile = ts.createSourceFile(
			'index.ts',
			`function x(a: number) { return 1 };`,
			ts.ScriptTarget.ES5,
			true,
			ts.ScriptKind.TS,
		);

		const rightSourceFile = ts.createSourceFile(
			'index.ts',
			`function y(b: number) { return 2 };`,
			ts.ScriptTarget.ES5,
			true,
			ts.ScriptKind.TS,
		);

		const similarity = calculateSimilarity(leftSourceFile, rightSourceFile);

		assert.approximately(similarity, 0.86, 0.01);
	});
});
