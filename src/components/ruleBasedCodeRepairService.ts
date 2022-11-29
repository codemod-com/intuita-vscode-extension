import type { CaseManager } from '../cases/caseManager';
import { RepairCodeByTscCaseSubKind } from '../cases/types';
import { buildCases } from '../classifier/buildCases';
import { buildClassifierDiagnostic } from '../classifier/buildClassifierDiagnostic';
import { classify } from '../classifier/classify';
import type { Configuration } from '../configuration';
import type { Container } from '../container';
import { buildReplacementEnvelope } from '../features/repairCode/buildReplacementEnvelope';
import { buildUriHash } from '../uris/buildUriHash';
import {
	assertsNeitherNullOrUndefined,
	isNeitherNullNorUndefined,
} from '../utilities';
import { Message, MessageBus, MessageKind } from './messageBus';

export class RuleBasedCoreRepairService {
	readonly #caseManager: CaseManager;
	readonly #configurationContainer: Container<Configuration>;
	readonly #messageBus: MessageBus;

	public constructor(
		caseManager: CaseManager,
		configurationContainer: Container<Configuration>,
		messageBus: MessageBus,
	) {
		this.#caseManager = caseManager;
		this.#configurationContainer = configurationContainer;
		this.#messageBus = messageBus;
		this.#messageBus.subscribe((message) => {
			if (message.kind === MessageKind.externalDiagnostics) {
				setImmediate(() => {
					this.#onExternalDiagnosticsMessage(message);
				});
			}
		});
	}

	#onExternalDiagnosticsMessage(
		message: Message & { kind: MessageKind.externalDiagnostics },
	): void {
		// TODO check
		return;

		const enhancements = message.enhancedDiagnostics
			.map((enhancedDiagnostic) => {
				const uriHash = buildUriHash(enhancedDiagnostic.uri);

				const file = message.uriHashFileMap.get(uriHash);
				assertsNeitherNullOrUndefined(file);

				const classifierDiagnostic = buildClassifierDiagnostic(
					file.separator,
					file.lengths,
					enhancedDiagnostic.diagnostic,
				);

				const classification = classify(
					file.sourceFile,
					classifierDiagnostic,
				);

				if (
					classification.subKind === RepairCodeByTscCaseSubKind.OTHER
				) {
					return null;
				}

				const replacementEnvelope = buildReplacementEnvelope(
					file,
					enhancedDiagnostic.diagnostic,
					classification,
				);

				return {
					classification,
					enhancedDiagnostic,
					file,
					replacementEnvelope,
				};
			})
			.filter(isNeitherNullNorUndefined);

		const { casesWithJobHashes, jobs } = buildCases(
			this.#caseManager.getCasesWithJobHashes(),
			enhancements,
		);

		this.#messageBus.publish({
			kind: MessageKind.upsertCases,
			uriHashFileMap: message.uriHashFileMap,
			casesWithJobHashes,
			jobs,
			inactiveDiagnosticHashes: message.inactiveDiagnosticHashes,
			inactiveJobHashes: new Set(),
			trigger: message.trigger,
		});
	}
}
