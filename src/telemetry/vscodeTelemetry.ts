import TelemetryReporter from '@vscode/extension-telemetry';
import { Event, ErrorEvent, Telemetry } from './telemetry';
import { Message, MessageBus, MessageKind } from '../components/messageBus';
import { Job } from '../jobs/types';
import { CaseHash } from '../cases/types';

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

		const jobsByExecution: Record<CaseHash, Job[]> = {};

		for (const job of deletedJobs) {
			const { caseHashDigest } = job;

			if (!jobsByExecution[caseHashDigest]) {
				jobsByExecution[caseHashDigest] = [];
			}

			jobsByExecution[caseHashDigest]?.push(job);
		}

		for (const [caseHashDigest, jobs] of Object.entries(jobsByExecution)) {
			this.sendEvent({
				kind: 'jobsAccepted',
				jobCount: jobs.length,
				executionId: caseHashDigest as CaseHash,
			});
		}
	}

	__onJobsRejectedMessage(
		message: Message & { kind: MessageKind.jobsRejected },
	): void {
		const { deletedJobs } = message;

		const jobsByExecution: Record<string, Job[]> = {};

		for (const job of deletedJobs) {
			const { caseHashDigest } = job;

			if (!jobsByExecution[caseHashDigest]) {
				jobsByExecution[caseHashDigest] = [];
			}

			jobsByExecution[caseHashDigest]?.push(job);
		}

		for (const [caseHashDigest, jobs] of Object.entries(jobsByExecution)) {
			this.sendEvent({
				kind: 'jobsRejected',
				jobCount: jobs.length,
				executionId: caseHashDigest as CaseHash,
			});
		}
	}

	__onCodemodSetExecuted(
		message: Message & { kind: MessageKind.codemodSetExecuted },
	): void {
		const { halted, caseHashDigest, jobs, codemodName } = message;

		if (halted) {
			this.sendEvent({
				kind: 'codemodHalted',
				executionId: caseHashDigest,
				fileCount: jobs.length,
				codemodName,
			});
			return;
		}

		this.sendEvent({
			kind: 'codemodExecuted',
			executionId: caseHashDigest,
			fileCount: jobs.length,
			codemodName,
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
