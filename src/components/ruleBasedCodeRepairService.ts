import { Configuration } from '../configuration';
import { Container } from '../container';
import { Message, MessageBus, MessageKind } from './messageBus';

export class RuleBasedCoreRepairService {
	public constructor(
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

		this._messageBus.publish({
			kind: MessageKind.ruleBasedCoreRepairDiagnosticsChanged,
			newExternalDiagnostics: message.newExternalDiagnostics,
			trigger: message.trigger,
		});
	}
}
