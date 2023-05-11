import TelemetryReporter from '@vscode/extension-telemetry';
import { Event, ErrorEvent, Telemetry } from './telemetry';

export class VscodeTelemetry implements Telemetry {
	constructor(private readonly __telemetryReporter: TelemetryReporter) {}

	sendEvent(event: Event): void {
		const { kind, ...properties } = event;

		this.__telemetryReporter.sendTelemetryEvent(kind, properties);
	}

	sendError(event: ErrorEvent): void {
		const { kind, ...properties } = event;
		this.__telemetryReporter.sendTelemetryErrorEvent(kind, properties);
	}
}
