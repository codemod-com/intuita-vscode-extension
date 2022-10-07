import { Configuration } from '../configuration';
import { Container } from '../container';
import { Message, MessageBus, MessageKind } from './messageBus';

export class RuleBasedCoreRepairService {
	public constructor(
		protected readonly _configurationContainer: Container<Configuration>,
		protected readonly _messageBus: MessageBus,
	) {
		this._messageBus.subscribe((message) => {
			if (message.kind === MessageKind.newExternalDiagnostics) {
				setImmediate(() => {
					this._onNewExternalDiagnosticsMessage(message);
				});
			}
		});
	}

	protected _onNewExternalDiagnosticsMessage(
		message: Message & { kind: MessageKind.newExternalDiagnostics },
	): void {
		const { preferRuleBasedCodeRepair } =
			this._configurationContainer.get();

		if (!preferRuleBasedCodeRepair) {
			return;
		}

		this._messageBus.publish({
			kind: MessageKind.ruleBasedCoreRepairDiagnosticsChanged,
			uri: message.uri,
			version: message.version,
			text: message.text,
			diagnostics: message.diagnostics,
			triggeredByThisUri: message.triggeredByThisUri,
			trigger: message.trigger,
		});
	}
}
