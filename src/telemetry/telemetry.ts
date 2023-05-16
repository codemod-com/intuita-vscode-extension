export type ErrorEvent = Readonly<{
	kind: 'failedToExecuteCommand';
	commandName: string;
	errorMessage: string;
}>;

export type Event =
	| Readonly<{
			kind: 'codemodExecuted';
			fileCount: number;
			executionId: string;
			codemodName: string;
	  }>
	| Readonly<{
			kind: 'codemodHalted';
			fileCount: number;
			executionId: string;
			codemodName: string;
	  }>
	| Readonly<{
			kind: 'jobAccepted';
			jobHash: string;
			executionId: string;
	  }>
	| Readonly<{
			kind: 'jobRejected';
			jobHash: string;
			executionId: string;
	  }>;

export interface Telemetry {
	sendEvent(event: Event): void;

	sendError(error: ErrorEvent): void;
}
