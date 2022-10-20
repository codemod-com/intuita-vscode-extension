import type { JobHash } from '../features/moveTopLevelNode/jobHash';
import type { UriHash } from '../uris/types';
import type { IntuitaSimpleRange } from '../utilities';

export type DiagnosticHash = string & { __DiagnosticHash: '__DiagnosticHash' };

export type DiagnosticHashIngredients =
	| Readonly<{ jobHash: JobHash }>
	| Readonly<{
			uriHash: UriHash;
			range: IntuitaSimpleRange;
			code: string;
			message: string;
			rangeText: string;
	  }>;
