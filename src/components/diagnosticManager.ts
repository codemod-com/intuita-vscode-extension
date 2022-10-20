import { Diagnostic, Uri } from 'vscode';
import {
	buildDiagnosticHash,
	buildDiagnosticHashIngredients,
} from '../diagnostics/buildDiagnosticHash';
import { DiagnosticHash } from '../diagnostics/types';
import {
	MessageBus,
	MessageKind,
	NewExternalDiagnostic,
	Trigger,
} from './messageBus';
import { VSCodeService } from './vscodeService';

const isDiagnosticSupported = ({ source, code }: Diagnostic): boolean => {
	if (source !== 'ts' || !code) {
		return false;
	}

	if (typeof code === 'string' || typeof code === 'number') {
		return String(code) === '2345';
	}

	return String(code.value) === '2345';
};

export class DiagnosticManager {
	protected readonly _seenHashes: Set<DiagnosticHash> = new Set();

	public constructor(
		protected readonly _messageBus: MessageBus,
		protected readonly _vscodeService: VSCodeService,
	) {}

	public async handleDiagnostics(trigger: Trigger) {
		const uriDiagnosticsTuples = this._vscodeService
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

		if (uriDiagnosticsTuples.length === 0) {
			return;
		}

		const noExternalDiagnosticsUri: ReadonlyArray<Uri> =
			uriDiagnosticsTuples
				.filter((tuple) => tuple[1].length === 0)
				.map(([uri]) => uri);

		const newExternalDiagnostics: NewExternalDiagnostic[] = [];

		for (const [uri, diagnostics] of uriDiagnosticsTuples) {
			if (diagnostics.length === 0) {
				continue;
			}

			const textDocument = await this._vscodeService.openTextDocument(
				uri,
			);

			const text = textDocument.getText();

			const newDiagnostics: Diagnostic[] = [];

			diagnostics.forEach((diagnostic) => {
				const ingredients = buildDiagnosticHashIngredients(
					uri,
					diagnostic,
					text,
				);

				const hash = buildDiagnosticHash(ingredients);

				if (this._seenHashes.has(hash)) {
					return;
				}

				this._seenHashes.add(hash);

				newDiagnostics.push(diagnostic);
			});

			if (newDiagnostics.length === 0) {
				continue;
			}

			newExternalDiagnostics.push({
				uri,
				text,
				version: textDocument.version,
				diagnostics: newDiagnostics,
			});
		}

		this._messageBus.publish({
			kind: MessageKind.externalDiagnostics,
			noExternalDiagnosticsUri,
			newExternalDiagnostics,
			trigger,
		});
	}
}
