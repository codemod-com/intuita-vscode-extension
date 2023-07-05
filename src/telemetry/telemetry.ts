import type { CaseHash } from '../cases/types';

export type ErrorEvent = Readonly<{
	kind: 'failedToExecuteCommand';
	commandName: string;
}>;

export type Event =
	| Readonly<{
			kind: 'codemodExecuted';
			fileCount: number;
			caseHashDigest: CaseHash;
			codemodName: string;
	  }>
	| Readonly<{
			kind: 'codemodHalted';
			fileCount: number;
			caseHashDigest: CaseHash;
			codemodName: string;
	  }>
	| Readonly<{
			kind: 'jobsAccepted';
			jobCount: number;
			caseHashDigest: CaseHash;
	  }>
	| Readonly<{
			kind: 'jobsRejected';
			jobCount: number;
			caseHashDigest: CaseHash;
	  }>;

export interface Telemetry {
	sendEvent(event: Event): void;

	sendError(error: ErrorEvent): void;
}
