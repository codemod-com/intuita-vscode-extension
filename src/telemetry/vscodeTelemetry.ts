import TelemetryReporter from '@vscode/extension-telemetry';
import { Event, ErrorEvent, Telemetry } from './telemetry';
import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { Job } from '../jobs/types';

export class VscodeTelemetry implements Telemetry {
	constructor(
		private readonly __telemetryReporter: TelemetryReporter,
		private readonly __messageBus: MessageBus,
	) {
		this.__messageBus.subscribe(
			MessageKind.codemodSetExecuted,
			(message) => {
				this.__onCodemodSetExecuted(message);
			},
		);

		this.__messageBus.subscribe(MessageKind.jobsAccepted, (message) =>
			this.__onJobsAcceptedMessage(message),
		);

		this.__messageBus.subscribe(MessageKind.jobsRejected, (message) =>
			this.__onJobsRejectedMessage(message),
		);
	}

	__onJobsAcceptedMessage(
		message: Message & { kind: MessageKind.jobsAccepted },
	): void {
		const { deletedJobs } = message;

		const jobsByExecution: Record<string, Job[]> = {};

		for (const job of deletedJobs) {
			const { executionId } = job;

			if (!jobsByExecution[executionId]) {
				jobsByExecution[executionId] = [];
			}

			jobsByExecution[executionId]?.push(job);
		}

		for (const [executionId, jobs] of Object.entries(jobsByExecution)) {
			this.sendEvent({
				kind: 'jobsAccepted',
				jobCount: jobs.length,
				executionId,
			});
		}
	}

	__onJobsRejectedMessage(
		message: Message & { kind: MessageKind.jobsRejected },
	): void {
		const { deletedJobs } = message;

		const jobsByExecution: Record<string, Job[]> = {};

		for (const job of deletedJobs) {
			const { executionId } = job;

			if (!jobsByExecution[executionId]) {
				jobsByExecution[executionId] = [];
			}

			jobsByExecution[executionId]?.push(job);
		}

		for (const [executionId, jobs] of Object.entries(jobsByExecution)) {
			this.sendEvent({
				kind: 'jobsRejected',
				jobCount: jobs.length,
				executionId,
			});
		}
	}

	__onCodemodSetExecuted(
		message: Message & { kind: MessageKind.codemodSetExecuted },
	): void {
		const { halted, executionId, jobs, codemodSetName } = message;

		if (halted) {
			this.sendEvent({
				kind: 'codemodHalted',
				executionId,
				fileCount: jobs.length,
				codemodName: codemodSetName,
			});
			return;
		}

		this.sendEvent({
			kind: 'codemodExecuted',
			executionId,
			fileCount: jobs.length,
			codemodName: codemodSetName,
		});
	}

	__rawEventToTelemetryEvent(event: ErrorEvent | Event): {
		properties: Record<string, string>;
		measurements: Record<string, number>;
		name: string;
	} {
		const properties: Record<string, string> = {};
		const measurements: Record<string, number> = {};

		for (const [key, value] of Object.entries(event)) {
			if (typeof value === 'string') {
				properties[key] = value;
				continue;
			}

			if (typeof value === 'number') {
				measurements[key] = value;
				continue;
			}
		}

		return {
			name: event.kind,
			properties,
			measurements,
		};
	}

	sendEvent(event: Event): void {
		const { name, properties, measurements } =
			this.__rawEventToTelemetryEvent(event);

		console.log('sendEvent', name, properties, measurements);

		this.__telemetryReporter.sendTelemetryEvent(
			name,
			properties,
			measurements,
		);
	}

	sendError(event: ErrorEvent): void {
		const { name, properties, measurements } =
			this.__rawEventToTelemetryEvent(event);
		this.__telemetryReporter.sendTelemetryErrorEvent(
			name,
			properties,
			measurements,
		);
	}
}
