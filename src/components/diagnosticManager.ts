import { Diagnostic } from 'vscode';
import {
	buildDiagnosticHash,
	buildDiagnosticHashIngredients,
} from '../diagnostics/buildDiagnosticHash';
import { DiagnosticHash } from '../diagnostics/types';
import { buildFile } from '../files/buildFile';
import { File } from '../files/types';
import { buildUriHash } from '../uris/buildUriHash';
import { UriHash } from '../uris/types';
import {
	EnhancedDiagnostic,
	Message,
	MessageBus,
	MessageKind,
	Trigger,
} from './messageBus';
import { VSCodeService } from './vscodeService';

const isDiagnosticSupported = ({ source, severity }: Diagnostic): boolean =>
	source === 'ts' && severity === 0;

export class DiagnosticManager {
	protected readonly _activeHashes: Set<DiagnosticHash> = new Set();

	public constructor(
		protected readonly _messageBus: MessageBus,
		protected readonly _vscodeService: VSCodeService,
	) {
		_messageBus.subscribe((message) => {
			if (message.kind === MessageKind.jobsAccepted) {
				setImmediate(() => {
					this._onJobAcceptedMessage(message);
				});
			}
		});
	}

	public async handleDiagnostics(trigger: Trigger) {
		const uriDiagnosticsTuples = this._getUriDiagnosticsTuples();

		const enhancedDiagnostics: EnhancedDiagnostic[] = [];
		const hashes = new Set<DiagnosticHash>();

		const uriHashFileMap = new Map<UriHash, File>();

		// assumption: all URIs are unique (by the virtue of the VSCode API)
		for (const [uri, diagnostics] of uriDiagnosticsTuples) {
			if (diagnostics.length === 0) {
				continue;
			}

			const uriHash = buildUriHash(uri);

			const textDocument = await this._vscodeService.openTextDocument(
				uri,
			);

			const text = textDocument.getText();

			const file = buildFile(uri, text, textDocument.version);

			uriHashFileMap.set(uriHash, file);

			diagnostics.forEach((diagnostic) => {
				const ingredients = buildDiagnosticHashIngredients(
					uriHash,
					diagnostic,
					text,
				);

				const hash = buildDiagnosticHash(ingredients);

				enhancedDiagnostics.push({
					uri,
					diagnostic,
					hash,
				});

				hashes.add(hash);
			});
		}

		const inactiveHashes: DiagnosticHash[] = [];

		this._activeHashes.forEach((hash) => {
			if (hashes.has(hash)) {
				return;
			}

			inactiveHashes.push(hash);
		});

		inactiveHashes.forEach((hash) => {
			this._activeHashes.delete(hash);
		});

		hashes.forEach((hash) => {
			this._activeHashes.add(hash);
		});

		this._messageBus.publish({
			kind: MessageKind.externalDiagnostics,
			uriHashFileMap,
			enhancedDiagnostics,
			inactiveHashes,
			trigger,
		});
	}

	protected _getUriDiagnosticsTuples = () => {
		return this._vscodeService
			.getDiagnostics()
			.filter(([uri]) => {
				const stringUri = uri.toString();

				return (
					!stringUri.includes('.intuita') &&
					!stringUri.includes('node_modules')
				);
			})
			.map(([uri, diagnostics]) => {
				return [
					uri,
					diagnostics.filter(isDiagnosticSupported),
				] as const;
			});
	};

	protected async _onJobAcceptedMessage(
		message: Message & { kind: MessageKind.jobsAccepted },
	) {
		for (const jobHash of message.deletedJobHashes) {
			this._activeHashes.delete(jobHash as unknown as DiagnosticHash);
		}
	}
}
