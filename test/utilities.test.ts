
import { assert } from 'chai';
import { moveElementInArray } from '../src/utilities';

describe('utilities', () => {
	it('moveElementInArray (0 elements, from 1 to 2)', () => {
		const array = moveElementInArray([], 1, 2);

		assert.deepEqual(array, []);
	});

	it('moveElementInArray (3 elements, from 0 to 0)', () => {
		const array = moveElementInArray([0, 1, 2], 0, 0);

		assert.deepEqual(array, [0, 1, 2]);
	});

	it('moveElementInArray (3 elements, from 0 to 1)', () => {
		const array = moveElementInArray([0, 1, 2], 0, 1);

		assert.deepEqual(array, [1, 0, 2]);
	});

	it('moveElementInArray (3 elements, from 0 to 2)', () => {
		const array = moveElementInArray([0, 1, 2], 0, 2);

		assert.deepEqual(array, [1, 2, 0]);
	});

	it('moveElementInArray (3 elements, from 1 to 0)', () => {
		const array = moveElementInArray([0, 1, 2], 1, 0);

		assert.deepEqual(array, [1, 0, 2]);
	});

	it('moveElementInArray (3 elements, from 1 to 1)', () => {
		const array = moveElementInArray([0, 1, 2], 1, 1);

		assert.deepEqual(array, [0, 1, 2]);
	});

	it('moveElementInArray (3 elements, from 1 to 2)', () => {
		const array = moveElementInArray([0, 1, 2], 1, 2);

		assert.deepEqual(array, [0, 2, 1]);
	});

	it('moveElementInArray (3 elements, from 2 to 0)', () => {
		const array = moveElementInArray([0, 1, 2], 2, 0);

		assert.deepEqual(array, [2, 0, 1]);
	});

	it('moveElementInArray (3 elements, from 2 to 1)', () => {
		const array = moveElementInArray([0, 1, 2], 2, 1);

		assert.deepEqual(array, [0, 2, 1]);
	});

	it('moveElementInArray (3 elements, from 2 to 2)', () => {
		const array = moveElementInArray([0, 1, 2], 2, 2);

		assert.deepEqual(array, [0, 1, 2]);
	});
});
