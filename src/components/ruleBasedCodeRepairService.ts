import type { CaseManager } from '../cases/caseManager';
import { CaseKind } from '../cases/types';
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
	public constructor(
		protected readonly _caseManager: CaseManager,
		protected readonly _configurationContainer: Container<Configuration>,
		protected readonly _messageBus: MessageBus,
	) {
		this._messageBus.subscribe((message) => {
			if (message.kind === MessageKind.externalDiagnostics) {
				setImmediate(() => {
					this._onExternalDiagnosticsMessage(message);
				});
			}
		});
	}

	protected _onExternalDiagnosticsMessage(
		message: Message & { kind: MessageKind.externalDiagnostics },
	): void {
		const { preferRuleBasedCodeRepair } =
			this._configurationContainer.get();

		if (!preferRuleBasedCodeRepair) {
			return;
		}

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

				if (classification.kind === CaseKind.OTHER) {
					return null;
				}

				const inferenceJob = buildReplacementEnvelope(
					file,
					enhancedDiagnostic.diagnostic,
					classification,
				);

				return {
					classification,
					enhancedDiagnostic,
					file,
					inferenceJob,
				};
			})
			.filter(isNeitherNullNorUndefined);

		const { casesWithJobHashes, jobs } = buildCases(
			this._caseManager.getCasesWithJobHashes(),
			enhancements,
		);

		this._messageBus.publish({
			kind: MessageKind.upsertCases,
			uriHashFileMap: message.uriHashFileMap,
			casesWithJobHashes,
			jobs,
			inactiveHashes: message.inactiveHashes,
			trigger: message.trigger,
		});
	}
}
