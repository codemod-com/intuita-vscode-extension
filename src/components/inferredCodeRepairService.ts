import Axios, { CancelToken, CancelTokenSource } from 'axios';
import {
	InferCommand,
	inferredMessageCodec,
	mapValidationToEither,
} from './inferenceService';
import { Uri } from 'vscode';
import { buildHash, isNeitherNullNorUndefined } from '../utilities';
import { basename, join } from 'node:path';
import { mkdir, writeFile } from 'node:fs';
import { promisify } from 'node:util';
import { Message, MessageBus, MessageKind } from './messageBus';
import { Container } from '../container';
import { Configuration } from '../configuration';
import { randomBytes } from 'node:crypto';
import { VSCodeService } from './vscodeService';

const promisifiedMkdir = promisify(mkdir);
const promisifiedWriteFile = promisify(writeFile);

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

			const fileBaseName = basename(stringUri);

			const hash = buildHash(
				[
					stringUri,
					String(newExternalDiagnostic.version),
					randomBytes(16).toString('base64url'),
				].join(','),
			);

			const directoryPath = join(workspacePath, `/.intuita/${hash}/`);

			const filePath = join(
				workspacePath,
				`/.intuita/${hash}/${fileBaseName}`,
			);

			const source = Axios.CancelToken.source();

			this._cancelTokenSourceMap.set(stringUri, source);

			await promisifiedMkdir(directoryPath, {
				recursive: true,
			});

			await promisifiedWriteFile(filePath, newExternalDiagnostic.text, {
				encoding: 'utf8',
			});

			const lineNumbers = new Set(
				newExternalDiagnostic.diagnostics.map(
					({ range }) => range.start.line,
				),
			);

			const command: InferCommand = {
				kind: 'infer',
				fileMetaHash: hash,
				filePath: stringUri,
				lineNumbers: Array.from(lineNumbers),
				workspacePath,
			};

			const response = await this._infer(command, source.token);

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

		// TODO remove the .intuita / hash directory
	}

	protected async _infer(command: InferCommand, cancelToken: CancelToken) {
		try {
			return await Axios.post('http://localhost:4000/infer', command, {
				cancelToken,
			});
		} catch (error) {
			if (Axios.isAxiosError(error)) {
				console.error(error.response?.data);
			}

			throw error;
		}
	}
}
