import * as t from 'io-ts';
import { buildTypeCodec } from '../../utilities';

export const applyChangesCoded = buildTypeCodec({
	diffId: t.string,
});
