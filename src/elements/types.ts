import type { Uri } from 'vscode';
import type { Job, JobHash } from '../jobs/types';
import type { IntuitaRange } from '../utilities';

export type ElementHash = string & { __ElementHash: '__ElementHash' };

export type JobElement = Readonly<{
	hash: ElementHash;
	kind: 'JOB';
	label: string;
	uri: Uri;
	jobHash: JobHash;
	fileName: string;
	range: IntuitaRange | null;
	job: Job;
}>;

export type FileElement = Readonly<{
	hash: ElementHash;
	kind: 'FILE';
	label: string;
	children: ReadonlyArray<JobElement>;
}>;

export type CaseElement = Readonly<{
	hash: ElementHash;
	kind: 'CASE';
	label: string;
	children: ReadonlyArray<FileElement>;
}>;

export type RootElement = Readonly<{
	hash: ElementHash;
	kind: 'ROOT';
	children: ReadonlyArray<CaseElement>;
}>;

export type Element = RootElement | CaseElement | FileElement | JobElement;
