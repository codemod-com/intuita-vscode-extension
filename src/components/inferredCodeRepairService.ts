import Axios, { CancelToken, CancelTokenSource } from 'axios';
import {
	inferredMessageCodec,
	mapValidationToEither,
} from './inferenceService';
import { Uri } from 'vscode';
import { buildHash, isNeitherNullNorUndefined } from '../utilities';
import { Message, MessageBus, MessageKind } from './messageBus';
import { Container } from '../container';
import { Configuration } from '../configuration';
import { VSCodeService } from './vscodeService';
import * as FormData from 'form-data';

export class InferredCodeRepairService {
	protected readonly _cancelTokenSourceMap: Map<string, CancelTokenSource> =
		new Map();

	public constructor(
		protected readonly _configurationContainer: Container<Configuration>,
		protected readonly _messageBus: MessageBus,
		protected readonly _vscodeService: VSCodeService,
	) {
		this._messageBus.subscribe((message) => {
			if (message.kind === MessageKind.textDocumentChanged) {
				setImmediate(() => {
					this._onTextDocumentChanged(message.uri);
				});
			}

			if (message.kind === MessageKind.externalDiagnostics) {
				setImmediate(() => {
					this._onExternalDiagnosticsMessage(message);
				});
			}
		});
	}

	private _cancel(uri: Uri) {
		const stringUri = uri.toString();

		const cancelTokenSource = this._cancelTokenSourceMap.get(stringUri);

		if (!cancelTokenSource) {
			return;
		}

		this._cancelTokenSourceMap.delete(stringUri);

		cancelTokenSource.cancel();
	}

	protected _onTextDocumentChanged(uri: Uri): void {
		this._cancel(uri);
	}

	protected async _onExternalDiagnosticsMessage(
		message: Message & { kind: MessageKind.externalDiagnostics },
	): Promise<void> {
		const { preferRuleBasedCodeRepair } =
			this._configurationContainer.get();

		if (preferRuleBasedCodeRepair) {
			return;
		}

		for (const newExternalDiagnostic of message.newExternalDiagnostics) {
			this._cancel(newExternalDiagnostic.uri);

			const workspacePath = this._vscodeService.getWorkspaceFolder(
				newExternalDiagnostic.uri,
			)?.uri.fsPath;

			if (!isNeitherNullNorUndefined(workspacePath)) {
				return;
			}

			const stringUri = newExternalDiagnostic.uri.toString();
			const uriHash = buildHash(stringUri);

			const source = Axios.CancelToken.source();

			this._cancelTokenSourceMap.set(stringUri, source);

			const lineNumbers = new Set(
				newExternalDiagnostic.diagnostics.map(
					({ range }) => range.start.line,
				),
			);

			const response = await this._infer(
				uriHash,
				Buffer.from(newExternalDiagnostic.text),
				Array.from(lineNumbers),
				source.token,
			);

			const dataEither = mapValidationToEither(
				inferredMessageCodec.decode(response.data),
			);

			if (dataEither._tag === 'Left') {
				throw new Error(
					`Could not decode the inferred message: ${dataEither.left}`,
				);
			}

			// TODO check if it works like that
			this._messageBus.publish({
				kind: MessageKind.createRepairCodeJobs,
				uri: newExternalDiagnostic.uri,
				text: newExternalDiagnostic.text,
				version: newExternalDiagnostic.version,
				inferenceJobs: dataEither.right.inferenceJobs,
				trigger: message.trigger,
			});
		}
	}

	protected async _infer(
		uriHash: string,
		buffer: Buffer,
		lineNumbers: number[],
		cancelToken: CancelToken,
	) {
		try {
			const formData = new FormData();
			formData.append('uriHash', uriHash);
			formData.append('file', buffer, { filename: 'index.ts' });
			formData.append('lineNumbers', lineNumbers.join(','));

			return await Axios.post('http://localhost:49674/infer', formData, {
				cancelToken,
				headers: formData.getHeaders(),
			});
		} catch (error) {
			if (Axios.isAxiosError(error)) {
				console.error(error.response?.data);
			}

			throw error;
		}
	}
}
