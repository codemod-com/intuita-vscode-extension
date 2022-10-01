import Axios, { CancelToken, CancelTokenSource } from 'axios';
import {
	InferCommand,
	inferredMessageCodec,
	mapValidationToEither,
} from './inferenceService';
import { Uri, WorkspaceFolder } from 'vscode';
import { buildHash, isNeitherNullNorUndefined } from '../utilities';
import { basename, join } from 'node:path';
import { mkdir, writeFile } from 'node:fs';
import { promisify } from 'node:util';
import { Message, MessageBus, MessageKind } from './messageBus';
import { Container } from '../container';
import { Configuration } from '../configuration';
import { randomBytes } from 'node:crypto';

const promisifiedMkdir = promisify(mkdir);
const promisifiedWriteFile = promisify(writeFile);

export class InferredCodeRepairService {
	protected readonly _cancelTokenSourceMap: Map<string, CancelTokenSource> =
		new Map();

	public constructor(
		protected readonly _configurationContainer: Container<Configuration>,
		protected readonly _getWorkspaceFolder: (
			uri: Uri,
		) => WorkspaceFolder | null,
		protected readonly _messageBus: MessageBus,
	) {
		this._messageBus.subscribe((message) => {
			if (message.kind === MessageKind.textDocumentChanged) {
				setImmediate(() => {
					this._onTextDocumentChanged(message.uri);
				});
			}

			if (message.kind === MessageKind.newExternalDiagnostics) {
				setImmediate(() => {
					this._onNewExternalDiagnosticsMessage(message);
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

	protected async _onNewExternalDiagnosticsMessage(
		message: Message & { kind: MessageKind.newExternalDiagnostics },
	): Promise<void> {
		const { preferRuleBasedCodeRepair } =
			this._configurationContainer.get();

		if (preferRuleBasedCodeRepair) {
			return;
		}

		this._cancel(message.uri);

		const workspacePath = this._getWorkspaceFolder(message.uri)?.uri.fsPath;

		if (!isNeitherNullNorUndefined(workspacePath)) {
			return;
		}

		const stringUri = message.uri.toString();

		const fileBaseName = basename(stringUri);

		const hash = buildHash(
			[
				stringUri,
				String(message.version),
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

		await promisifiedWriteFile(filePath, message.text, {
			encoding: 'utf8',
		});

		const lineNumbers = new Set(
			message.diagnostics.map(({ range }) => range.start.line),
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

		this._messageBus.publish({
			kind: MessageKind.createRepairCodeJobs,
			uri: message.uri,
			text: message.text,
			version: message.version,
			inferenceJobs: dataEither.right.inferenceJobs,
		});

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
