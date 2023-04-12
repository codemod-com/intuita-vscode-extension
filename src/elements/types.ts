import type { Uri } from 'vscode';
import type { Job, JobHash } from '../jobs/types';

export type ElementHash = string & { __ElementHash: '__ElementHash' };

export enum ElementKind {
	JOB = 'JOB',
	FILE = 'FILE',
	CASE = 'CASE',
	ROOT = 'ROOT',
}

export type JobElement = Readonly<{
	hash: ElementHash;
	kind: ElementKind.JOB;
	label: string;
	uri: Uri | null;
	jobHash: JobHash;
	job: Job;
}>;

export type FileElement = Readonly<{
	hash: ElementHash;
	kind: ElementKind.FILE;
	label: string;
	children: ReadonlyArray<JobElement>;
}>;

export type CaseElement = Readonly<{
	hash: ElementHash;
	kind: ElementKind.CASE;
	label: string;
	children: ReadonlyArray<FileElement>;
}>;

export type RootElement = Readonly<{
	hash: ElementHash;
	kind: ElementKind.ROOT;
	children: ReadonlyArray<CaseElement>;
}>;

export type Element = RootElement | CaseElement | FileElement | JobElement;
