import { assert } from 'chai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Entry } from '../entry';
import {
	buildDiagnosticHash,
	buildDiagnosticHashIngredients,
} from '../../src/diagnostics/buildDiagnosticHash';
import { buildUriHash } from '../../src/uris/buildUriHash';
import { UriHash } from '../../src/uris/types';
import { VscodeDiagnostic, VscodeRange } from '../../src/vscode/types';

describe('buildDiagnosticHash', () => {
	it('should classify correctly', () => {
		const uriHash = buildUriHash('index.ts');

		const fileText = readFileSync(
			join(__dirname, '../classifier/code.txt'),
		).toString('utf8');

		const entries: Entry[] = JSON.parse(
			readFileSync(
				join(__dirname, '../classifier/diagnostics.txt'),
			).toString('utf8'),
		);

		const diagnostics = entries.map((entry): VscodeDiagnostic => {
			const range: VscodeRange = {
				start: {
					line: entry.startLineNumber - 1,
					character: entry.startColumn - 1,
				},
				end: {
					line: entry.endLineNumber - 1,
					character: entry.endColumn - 1,
				},
			};

			return {
				code: Number(entry.code),
				message: entry.message,
				range,
			};
		});

		const ingredients = diagnostics.map((diagnostic) =>
			buildDiagnosticHashIngredients(uriHash, diagnostic, fileText),
		);

		assert.deepEqual(ingredients, [
			{
				uriHash: 'FVo4CTx9cHoE1aP2usiqa9T-BBM' as UriHash,
				range: { start: 189, end: 190 },
				code: '2769',
				message:
					'No overload matches this call.\n' +
					"  Overload 1 of 4, '(target: {}, source: { b: number | null; }): { b: number | null; }', gave the following error.\n" +
					"    Argument of type 'string | null' is not assignable to parameter of type '{}'.\n" +
					"      Type 'null' is not assignable to type '{}'.\n" +
					"  Overload 2 of 4, '(target: object, ...sources: any[]): any', gave the following error.\n" +
					"    Argument of type 'string | null' is not assignable to parameter of type 'object'.\n" +
					"      Type 'null' is not assignable to type 'object'.",
				rangeText: 'a',
			},
			{
				uriHash: 'FVo4CTx9cHoE1aP2usiqa9T-BBM' as UriHash,
				range: { start: 215, end: 216 },
				code: '2769',
				message:
					'No overload matches this call.\n' +
					"  Overload 1 of 4, '(target: {}, source: { c: boolean | null; }): { c: boolean | null; }', gave the following error.\n" +
					"    Argument of type 'number | null' is not assignable to parameter of type '{}'.\n" +
					"      Type 'null' is not assignable to type '{}'.\n" +
					"  Overload 2 of 4, '(target: object, ...sources: any[]): any', gave the following error.\n" +
					"    Argument of type 'number | null' is not assignable to parameter of type 'object'.\n" +
					"      Type 'null' is not assignable to type 'object'.",
				rangeText: 'b',
			},
			{
				uriHash: 'FVo4CTx9cHoE1aP2usiqa9T-BBM' as UriHash,
				range: { start: 240, end: 241 },
				code: '2769',
				message:
					'No overload matches this call.\n' +
					"  Overload 1 of 4, '(target: {}, source: {}): {}', gave the following error.\n" +
					"    Argument of type 'boolean | null' is not assignable to parameter of type '{}'.\n" +
					"      Type 'null' is not assignable to type '{}'.\n" +
					"  Overload 2 of 4, '(target: object, ...sources: any[]): any', gave the following error.\n" +
					"    Argument of type 'boolean | null' is not assignable to parameter of type 'object'.\n" +
					"      Type 'null' is not assignable to type 'object'.",
				rangeText: 'c',
			},
			{
				uriHash: 'FVo4CTx9cHoE1aP2usiqa9T-BBM' as UriHash,
				range: { start: 262, end: 263 },
				code: '2769',
				message:
					'No overload matches this call.\n' +
					"  Overload 1 of 4, '(target: {}, source: { c: boolean | null; }): { c: boolean | null; }', gave the following error.\n" +
					"    Argument of type 'string | undefined' is not assignable to parameter of type '{}'.\n" +
					"      Type 'undefined' is not assignable to type '{}'.\n" +
					"  Overload 2 of 4, '(target: object, ...sources: any[]): any', gave the following error.\n" +
					"    Argument of type 'string | undefined' is not assignable to parameter of type 'object'.\n" +
					"      Type 'undefined' is not assignable to type 'object'.",
				rangeText: 'd',
			},
			{
				uriHash: 'FVo4CTx9cHoE1aP2usiqa9T-BBM' as UriHash,
				range: { start: 287, end: 288 },
				code: '2769',
				message:
					'No overload matches this call.\n' +
					"  Overload 1 of 4, '(target: {}, source: { c: boolean | null; }): { c: boolean | null; }', gave the following error.\n" +
					"    Argument of type '{} | null | undefined' is not assignable to parameter of type '{}'.\n" +
					"      Type 'undefined' is not assignable to type '{}'.\n" +
					"  Overload 2 of 4, '(target: object, ...sources: any[]): any', gave the following error.\n" +
					"    Argument of type '{} | null | undefined' is not assignable to parameter of type 'object'.\n" +
					"      Type 'undefined' is not assignable to type 'object'.",
				rangeText: 'e',
			},
		]);

		const hashes = ingredients.map((i) => buildDiagnosticHash(i));

		assert.deepEqual(hashes, [
			'gRpmGnIqKXqnGH4cEhcXCUiLFEw',
			'DO8uJU0EMVGTw08kxAKLvkC7z2c',
			'x5Ajy-cotN9ERQ8jBalSq-0BFpU',
			'Ayp9OCMKZu8P-bGlQ4pAMV8K59g',
			'RXkqLtMlBPoNP4S-0Vx5J5AdkMs',
		]);
	});
});
