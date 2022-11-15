import { assert } from 'chai';
import { calculateNodesScore } from '../src/features/moveTopLevelNode/2_factBuilders/calculateNodesScore';
import {
	DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
	DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
	TopLevelNodeModifier,
	TopLevelNodeKind,
} from '../src/features/moveTopLevelNode/2_factBuilders/topLevelNode';

describe('calculateNodesScore', function () {
	it('should return 0 for an 0 elements', () => {
		const score = calculateNodesScore(
			[],
			DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
			DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
		);

		assert.deepEqual(score, [0, 0]);
	});

	it('should return 0 for an array with 1 element', () => {
		const score = calculateNodesScore(
			[
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.class,
				},
			],
			DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
			DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
		);

		assert.deepEqual(score, [0, 0]);
	});

	it('should return 0 for an array with 2 ordered elements', () => {
		const score = calculateNodesScore(
			[
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.enum,
				},
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.type,
				},
			],
			DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
			DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
		);

		assert.deepEqual(score, [0, 0]);
	});

	it('should return a positive number for an array with 2 unordered elements', () => {
		const score = calculateNodesScore(
			[
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.type,
				},
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.enum,
				},
			],
			DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
			DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
		);

		assert.approximately(score[0], 0.0, 0.0001);
	});

	it('should return a positive number for an array with 2 unordered elements', () => {
		const score = calculateNodesScore(
			[
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.unknown,
				},
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.enum,
				},
			],
			DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
			DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
		);

		assert.approximately(score[0], 0, 0.0001);
	});

	it('should return a positive number for an array with 3 unordered elements', () => {
		const score = calculateNodesScore(
			[
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.unknown,
				},
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.constVariable,
				},
				{
					modifier: TopLevelNodeModifier.none,
					kind: TopLevelNodeKind.enum,
				},
			],
			DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
			DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
		);

		assert.approximately(score[0], 0, 0.0001);
	});

	it('should return a positive number for an array with 8 unordered elements', () => {
		const nodes = DEFAULT_TOP_LEVEL_NODE_KIND_ORDER.slice()
			.reverse()
			.map((kind) => ({
				modifier: TopLevelNodeModifier.none,
				kind,
			}));

		const score = calculateNodesScore(
			nodes,
			DEFAULT_TOP_LEVEL_NODE_MODIFIER_ORDER,
			DEFAULT_TOP_LEVEL_NODE_KIND_ORDER,
		);

		assert.approximately(score[0], 0.0, 0.0001);
	});
});
