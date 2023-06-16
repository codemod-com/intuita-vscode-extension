import * as t from 'io-ts';
import { buildTypeCodec } from '../utilities';

export const syntheticErrorCodec = buildTypeCodec({
	kind: t.literal('syntheticError'),
	message: t.string,
});

export const workspaceStateCodec = t.union([
	buildTypeCodec({
		_tag: t.literal('Left'),
		left: syntheticErrorCodec,
	}),
	buildTypeCodec({
		_tag: t.literal('Right'),
		right: t.string,
	}),
	buildTypeCodec({
		_tag: t.literal('Both'),
		left: syntheticErrorCodec,
		right: t.string,
	}),
]);
