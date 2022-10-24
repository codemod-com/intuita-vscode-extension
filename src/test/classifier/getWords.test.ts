import * as ts from 'typescript';
import {
	buildBagOfWords,
	calculateCosineSimilarity,
	getWords,
	normalizeBagsOfWords,
} from '../../classifier/similarity';
import { assert } from 'chai';

describe('calculateCosineSimilarity', () => {
	it('should calculate correct similarity', () => {
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

		const leftWords = getWords(leftSourceFile);
		const rightWords = getWords(rightSourceFile);

		assert.deepEqual(leftWords, ['Object', 'assign', 'a', '1', 'test1']);
		assert.deepEqual(rightWords, ['Object', 'assign', 'b', '1', 'test2']);

		const leftBagOfWords = buildBagOfWords(leftWords);
		const rightBagOfWords = buildBagOfWords(rightWords);

		assert.equal(leftBagOfWords.size, 5);
		assert.equal(rightBagOfWords.size, 5);

		const [leftVector, rightVector] = normalizeBagsOfWords(
			leftBagOfWords,
			rightBagOfWords,
		);

		assert.deepEqual(leftVector, [1, 1, 1, 1, 1, 0, 0]);
		assert.deepEqual(rightVector, [1, 1, 0, 1, 0, 1, 1]);

		const similarity = calculateCosineSimilarity(leftVector, rightVector);

		assert.approximately(similarity, 0.6, 0.01);
	});
});
