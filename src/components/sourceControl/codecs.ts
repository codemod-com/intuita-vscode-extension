import * as t from 'io-ts';
import { buildTypeCodec } from '../../utilities';

export const applyChangesCoded = buildTypeCodec({
	jobHashes: t.readonlyArray(t.string),
	diffId: t.string,
});
