import { Diagnostic, Uri } from 'vscode';
import { buildHash } from '../utilities';
import {
	MessageBus,
	MessageKind,
	NewExternalDiagnostic,
	Trigger,
} from './messageBus';
import { VSCodeService } from './vscodeService';

type DiagnosticHash = string & { __type: 'DiagnosticHash' };

const stringifyCode = (code: Diagnostic['code']): string => {
	if (code === undefined) {
		return '';
	}

	if (typeof code === 'string') {
		return code;
	}

	if (typeof code === 'number') {
		return String(code);
	}

	return [String(code.value), code.target.toString()].join(',');
};

const buildDiagnosticHash = (
	uri: Uri,
	version: number,
	diagnostic: Diagnostic,
): DiagnosticHash => {
	return buildHash(
		[
			uri.toString(),
			String(version),
			String(diagnostic.range.start.line),
			String(diagnostic.range.start.character),
			String(diagnostic.range.end.line),
			String(diagnostic.range.end.character),
			diagnostic.message,
			diagnostic.severity,
			diagnostic.source ?? '',
			stringifyCode(diagnostic.code),
		].join(','),
	) as DiagnosticHash;
};

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

			const newDiagnostics: Diagnostic[] = [];

			diagnostics.forEach((diagnostic) => {
				const hash = buildDiagnosticHash(
					uri,
					textDocument.version,
					diagnostic,
				);

				if (this._seenHashes.has(hash)) {
					return;
				}

				this._seenHashes.add(hash);

				newDiagnostics.push(diagnostic);
			});

			if (newDiagnostics.length === 0) {
				continue;
			}

			const text = textDocument.getText();

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
