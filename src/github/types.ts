import { buildTypeCodec } from '../utilities';
import * as t from 'io-ts';

export const createIssueResponseCodec = buildTypeCodec({
	html_url: t.string,
});

export type CreateIssueResponse = t.TypeOf<typeof createIssueResponseCodec>;
