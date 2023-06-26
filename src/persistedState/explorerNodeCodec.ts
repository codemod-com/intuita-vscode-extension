import * as t from 'io-ts';
import { jobHashCodec } from '../jobs/types';
import { buildTypeCodec } from '../utilities';

interface ExplorerNodeHashDigestBrand {
	readonly __ExplorerNodeHashDigest: unique symbol;
}

export const explorerNodeHashDigestCodec = t.brand(
	t.string,
	(
		hashDigest,
	): hashDigest is t.Branded<string, ExplorerNodeHashDigestBrand> =>
		hashDigest.length > 0,
	'__ExplorerNodeHashDigest',
);

export type ExplorerNodeHashDigest = t.TypeOf<
	typeof explorerNodeHashDigestCodec
>;

export const explorerNodeCodec = t.union([
	buildTypeCodec({
		hashDigest: explorerNodeHashDigestCodec,
		kind: t.literal('ROOT'),
		label: t.string,
		depth: t.number,
	}),
	buildTypeCodec({
		hashDigest: explorerNodeHashDigestCodec,
		kind: t.literal('DIRECTORY'),
		label: t.string,
		depth: t.number,
	}),
	buildTypeCodec({
		hashDigest: explorerNodeHashDigestCodec,
		kind: t.literal('FILE'),
		path: t.string,
		label: t.string,
		depth: t.number,
		jobHash: jobHashCodec,
		fileAdded: t.boolean,
	}),
]);

export type ExplorerNode = t.TypeOf<typeof explorerNodeCodec>;
