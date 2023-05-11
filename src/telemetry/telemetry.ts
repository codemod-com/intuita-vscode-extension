export type ErrorEvent = Readonly<{
	kind: 'failedToExecuteCommand';
	commandName: string;
	errorMessage: string;
}>;

// @TODO
export type Event = Readonly<{
	kind: 'event';
}>;

export interface Telemetry {
	sendEvent(event: Event): void;

	sendError(error: ErrorEvent): void;
}
