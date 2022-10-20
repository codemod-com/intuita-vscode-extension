import type { Uri } from 'vscode';
import type { JobHash } from '../features/moveTopLevelNode/jobHash';
import type { IntuitaSimpleRange } from '../utilities';

export type DiagnosticHash = string & { __DiagnosticHash: '__DiagnosticHash' };

export type DiagnosticHashIngredients =
	| Readonly<{ jobHash: JobHash }>
	| Readonly<{
			uri: Uri;
			range: IntuitaSimpleRange;
			code: string;
			message: string;
			rangeText: string;
	  }>;
