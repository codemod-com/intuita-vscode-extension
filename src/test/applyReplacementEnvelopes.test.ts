import { assert } from 'chai';
import { ReplacementEnvelope } from '../components/inferenceService';
import { applyReplacementEnvelopes } from '../jobs/applyReplacementEnvelopes';

describe('applyReplacementEnvelopes', () => {
	const oldText = '01234567890123456789012345678901234567890123456789';

	it('should do 0 replacements for no replacement envelopes', () => {
		const newText = applyReplacementEnvelopes(oldText, []);

		assert.equal(newText, oldText);
		assert.equal(newText.length, 50);
	});

	it('should do 1 replacement with maintaining the original length', () => {
		const replacement: ReplacementEnvelope = {
			range: {
				start: 10,
				end: 20,
			},
			replacement: 'abcdefghij',
		};

		const newText = applyReplacementEnvelopes(oldText, [replacement]);

		assert.equal(
			newText,
			'0123456789abcdefghij012345678901234567890123456789',
		);
		assert.equal(newText.length, 50);
	});

	it('should do 1 replacement with shrinking the original length', () => {
		const replacement: ReplacementEnvelope = {
			range: {
				start: 10,
				end: 20,
			},
			replacement: 'abcde',
		};

		const newText = applyReplacementEnvelopes(oldText, [replacement]);

		assert.equal(newText, '0123456789abcde012345678901234567890123456789');
		assert.equal(newText.length, 45);
	});

	it('should do 1 replacement with expanding the original length', () => {
		const replacement: ReplacementEnvelope = {
			range: {
				start: 10,
				end: 20,
			},
			replacement: 'abcdefghijklmno',
		};

		const newText = applyReplacementEnvelopes(oldText, [replacement]);

		assert.equal(
			newText,
			'0123456789abcdefghijklmno012345678901234567890123456789',
		);
		assert.equal(newText.length, 55);
	});

	it('should do empty 3 replacements with shrinking the original length', () => {
		const replacements: ReplacementEnvelope[] = [
			{
				range: {
					start: 5,
					end: 10,
				},
				replacement: '',
			},
			{
				range: {
					start: 20,
					end: 30,
				},
				replacement: '',
			},
			{
				range: {
					start: 40,
					end: 45,
				},
				replacement: '',
			},
		];

		const newText = applyReplacementEnvelopes(oldText, replacements);

		assert.equal(newText, '012340123456789012345678956789');
		assert.equal(newText.length, 30);
	});

	it('should do empty 3 replacements with expanding the original length', () => {
		const replacements: ReplacementEnvelope[] = [
			{
				range: {
					start: 5,
					end: 10,
				},
				replacement: 'aaaaaaaaaaaaaaa', // +10
			},
			{
				range: {
					start: 20,
					end: 30,
				},
				replacement: 'bbbbbbbbbbbbbbb', // +5
			},
			{
				range: {
					start: 40,
					end: 45,
				},
				replacement: 'ccccccccccccccc', // +10
			},
		];

		const newText = applyReplacementEnvelopes(oldText, replacements);

		assert.equal(
			newText,
			'01234aaaaaaaaaaaaaaa0123456789bbbbbbbbbbbbbbb0123456789ccccccccccccccc56789',
		);
		assert.equal(newText.length, 50 + 25);
	});

	it('should do empty 3 replacements with different replacements', () => {
		const replacements: ReplacementEnvelope[] = [
			{
				range: {
					start: 5,
					end: 10,
				},
				replacement: '', // -5
			},
			{
				range: {
					start: 20,
					end: 30,
				},
				replacement: 'bbbbbbbbbbbbbbb', // +5
			},
			{
				range: {
					start: 40,
					end: 45,
				},
				replacement: '', // -5
			},
		];

		const newText = applyReplacementEnvelopes(oldText, replacements);

		assert.equal(newText, '012340123456789bbbbbbbbbbbbbbb012345678956789');
		assert.equal(newText.length, 50 - 5);
	});
});
