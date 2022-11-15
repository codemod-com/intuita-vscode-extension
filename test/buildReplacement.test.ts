import { assert } from 'chai';

import { factory } from 'typescript';
import {
	buildReplacement,
	buildTs2769ObjectAssignReplacement,
} from '../src/features/repairCode/buildReplacement';

describe('buildReplacement', () => {
	it("should change the '' string into the 0 number", () => {
		const replacement = buildReplacement({
			text: "''",
			receivedKind: 'string',
			expectedKind: 'number',
		});

		assert.equal(replacement, '0');
	});

	it("should change the '-123456789.12345678' string into the number", () => {
		const replacement = buildReplacement({
			text: "'-123456789.12345678'",
			receivedKind: 'string',
			expectedKind: 'number',
		});

		assert.equal(replacement, '-123456789.12345678');
	});

	it("should change the '20' string into the 20 number", () => {
		const replacement = buildReplacement({
			text: "'20'",
			receivedKind: 'string',
			expectedKind: 'number',
		});

		assert.equal(replacement, '20');
	});

	it('should change the "20" string into the 20 number', () => {
		const replacement = buildReplacement({
			text: '"20"',
			receivedKind: 'string',
			expectedKind: 'number',
		});

		assert.equal(replacement, '20');
	});

	it('should change the stringVariable string into the wrapped number', () => {
		const replacement = buildReplacement({
			text: 'stringVariable',
			receivedKind: 'string',
			expectedKind: 'number',
		});

		assert.equal(replacement, 'Number(stringVariable)');
	});

	it("should change the 0 number into '0' string", () => {
		const replacement = buildReplacement({
			text: '0',
			receivedKind: 'number',
			expectedKind: 'string',
		});

		assert.equal(replacement, "'0'");
	});

	it("should change the -123456789.123456789 number into '-123456789.123456789' string", () => {
		const replacement = buildReplacement({
			text: '-123456789.123456789',
			receivedKind: 'number',
			expectedKind: 'string',
		});

		assert.equal(replacement, "'-123456789.123456789'");
	});

	it("should change the 20 number into the '20' string", () => {
		const replacement = buildReplacement({
			text: '20',
			receivedKind: 'number',
			expectedKind: 'string',
		});

		assert.equal(replacement, "'20'");
	});

	it('should change the numberVariable number into the wrapper string', () => {
		const replacement = buildReplacement({
			text: 'numberVariable',
			receivedKind: 'number',
			expectedKind: 'string',
		});

		assert.equal(replacement, 'String(numberVariable)');
	});

	it("should change the 'false' string into the false boolean", () => {
		const replacement = buildReplacement({
			text: "'false'",
			receivedKind: 'string',
			expectedKind: 'boolean',
		});

		assert.equal(replacement, 'false');
	});

	it("should change the 'true' string into the true boolean", () => {
		const replacement = buildReplacement({
			text: "'true'",
			receivedKind: 'string',
			expectedKind: 'boolean',
		});

		assert.equal(replacement, 'true');
	});

	it('should change the "false" string into the false boolean', () => {
		const replacement = buildReplacement({
			text: '"false"',
			receivedKind: 'string',
			expectedKind: 'boolean',
		});

		assert.equal(replacement, 'false');
	});

	it('should change the "true" string into the false boolean', () => {
		const replacement = buildReplacement({
			text: '"true"',
			receivedKind: 'string',
			expectedKind: 'boolean',
		});

		assert.equal(replacement, 'true');
	});

	it('should change the stringVariable string into the wrapper boolean', () => {
		const replacement = buildReplacement({
			text: 'stringVariable',
			receivedKind: 'string',
			expectedKind: 'boolean',
		});

		assert.equal(replacement, 'Boolean(stringVariable)');
	});

	it('should change the false boolean into the "false" string', () => {
		const replacement = buildReplacement({
			text: 'false',
			receivedKind: 'boolean',
			expectedKind: 'string',
		});

		assert.equal(replacement, "'false'");
	});

	it('should change the true boolean into the "true" string', () => {
		const replacement = buildReplacement({
			text: 'true',
			receivedKind: 'boolean',
			expectedKind: 'string',
		});

		assert.equal(replacement, "'true'");
	});

	it('should change the booleanVariable boolean into the wrapped string', () => {
		const replacement = buildReplacement({
			text: 'booleanVariable',
			receivedKind: 'boolean',
			expectedKind: 'string',
		});

		assert.equal(replacement, 'String(booleanVariable)');
	});

	it('should change the 0 number into the false boolean', () => {
		const replacement = buildReplacement({
			text: '0',
			receivedKind: 'number',
			expectedKind: 'boolean',
		});

		assert.equal(replacement, 'false');
	});

	it('should change the -123456789.123456789 number into the true boolean', () => {
		const replacement = buildReplacement({
			text: '-123456789.123456789',
			receivedKind: 'number',
			expectedKind: 'boolean',
		});

		assert.equal(replacement, 'true');
	});

	it('should change the numberVariable number into the wrapper boolean', () => {
		const replacement = buildReplacement({
			text: 'numberVariable',
			receivedKind: 'number',
			expectedKind: 'boolean',
		});

		assert.equal(replacement, 'Boolean(numberVariable)');
	});

	it('should change the false boolean into the 0 number', () => {
		const replacement = buildReplacement({
			text: 'false',
			receivedKind: 'boolean',
			expectedKind: 'number',
		});

		assert.equal(replacement, '0');
	});

	it('should change the true boolean into the 1 number', () => {
		const replacement = buildReplacement({
			text: 'true',
			receivedKind: 'boolean',
			expectedKind: 'number',
		});

		assert.equal(replacement, '1');
	});

	it('should change the booleanVariable boolean into the wrapper number', () => {
		const replacement = buildReplacement({
			text: 'true',
			receivedKind: 'boolean',
			expectedKind: 'number',
		});

		assert.equal(replacement, '1');
	});
});

describe('buildTs2769ObjectAssignReplacement', () => {
	it('should return a proper string for Object.assign(a,{b:c},d)', () => {
		const replacement = buildTs2769ObjectAssignReplacement([
			factory.createIdentifier('a'),
			factory.createObjectLiteralExpression([
				factory.createPropertyAssignment(
					factory.createIdentifier('b'),
					factory.createNumericLiteral('c'),
				),
			]),
			factory.createIdentifier('d'),
		]);

		assert.equal(replacement, 'a = Object.assign({}, a, { b: c }, d)');
	});

	it('should return a proper string for Object.assign(a.b,c(d))', () => {
		const replacement = buildTs2769ObjectAssignReplacement([
			factory.createPropertyAccessExpression(
				factory.createIdentifier('a'),
				factory.createIdentifier('b'),
			),
			factory.createCallExpression(
				factory.createIdentifier('c'),
				undefined,
				[factory.createIdentifier('d')],
			),
		]);

		assert.equal(replacement, 'a.b = Object.assign({}, a.b, c(d))');
	});

	it('should return a proper multine string for Object.assign(a.b,{c:true,d:e.f})', () => {
		const replacement = buildTs2769ObjectAssignReplacement([
			factory.createPropertyAccessExpression(
				factory.createIdentifier('a'),
				factory.createIdentifier('b'),
			),
			factory.createObjectLiteralExpression(
				[
					factory.createPropertyAssignment(
						factory.createIdentifier('c'),
						factory.createTrue(),
					),
					factory.createPropertyAssignment(
						factory.createIdentifier('d'),
						factory.createPropertyAccessExpression(
							factory.createIdentifier('e'),
							factory.createIdentifier('f'),
						),
					),
				],
				true,
			),
		]);

		assert.equal(
			replacement,
			'a.b = Object.assign({}, a.b, {\n    c: true,\n    d: e.f\n})',
		);
	});
});
