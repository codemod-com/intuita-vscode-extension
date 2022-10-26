import Axios, { CancelToken, CancelTokenSource } from 'axios';
import {
	inferredMessageCodec,
	mapValidationToEither,
} from './inferenceService';
import { Uri } from 'vscode';
import {
	EnhancedDiagnostic,
	Message,
	MessageBus,
	MessageKind,
} from './messageBus';
import { Container } from '../container';
import { Configuration } from '../configuration';
import * as FormData from 'form-data';
import { buildUriHash } from '../uris/buildUriHash';
import { UriHash } from '../uris/types';
import { buildCases } from '../classifier/buildCases';
import { CaseManager } from '../cases/caseManager';
import { JobIngredients } from '../classifier/types';
import { buildClassifierDiagnostic } from '../classifier/buildClassifierDiagnostic';
import { classify } from '../classifier/classify';
import { File } from '../files/types';

export class InferredCodeRepairService {
	protected readonly _cancelTokenSourceMap: Map<UriHash, CancelTokenSource> =
		new Map();

	public constructor(
		protected readonly _caseManager: CaseManager,
		protected readonly _configurationContainer: Container<Configuration>,
		protected readonly _messageBus: MessageBus,
	) {
		this._messageBus.subscribe((message) => {
			if (message.kind === MessageKind.externalFileUpdated) {
				setImmediate(() => {
					this._onExternalFileUpdatedMessage(message.uri);
				});
			}

			if (message.kind === MessageKind.externalDiagnostics) {
				setImmediate(() => {
					this._onExternalDiagnosticsMessage(message);
				});
			}
		});
	}

	private _cancel(uriHash: UriHash) {
		const cancelTokenSource = this._cancelTokenSourceMap.get(uriHash);

		if (!cancelTokenSource) {
			return;
		}

		this._cancelTokenSourceMap.delete(uriHash);

		cancelTokenSource.cancel();
	}

	protected _onExternalFileUpdatedMessage(uri: Uri): void {
		this._cancel(buildUriHash(uri));
	}

	protected async _onExternalDiagnosticsMessage(
		message: Message & { kind: MessageKind.externalDiagnostics },
	): Promise<void> {
		const { preferRuleBasedCodeRepair } =
			this._configurationContainer.get();

		if (preferRuleBasedCodeRepair) {
			return;
		}

		const jobIngredients = await Promise.all(
			message.enhancedDiagnostics.map((enhancedDiagnostic) =>
				this._buildJobIngredients(
					message.uriHashFileMap,
					enhancedDiagnostic,
				),
			),
		);

		const { casesWithJobHashes, jobs } = buildCases(
			this._caseManager.getCasesWithJobHashes(),
			jobIngredients,
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

	protected async _buildJobIngredients(
		uriHashFileMap: ReadonlyMap<UriHash, File>,
		enhancedDiagnostic: EnhancedDiagnostic,
	): Promise<JobIngredients> {
		const uriHash = buildUriHash(enhancedDiagnostic.uri);
		const file = uriHashFileMap.get(uriHash) ?? null;

		if (file === null) {
			throw new Error('Could not find a File for the provided uriHash');
		}

		this._cancel(uriHash);

		const source = Axios.CancelToken.source();

		this._cancelTokenSourceMap.set(uriHash, source);

		const lineNumbers = [enhancedDiagnostic.diagnostic.range.start.line];

		const response = await this._infer(
			uriHash,
			Buffer.from(file.text),
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

		const { inferenceJobs } = dataEither.right;

		if (!inferenceJobs[0]) {
			throw new Error(`Could not find any inference jobs`);
		}

		const classifierDiagnostic = buildClassifierDiagnostic(
			file.separator,
			file.lengths,
			enhancedDiagnostic.diagnostic,
		);

		const classification = classify(file.sourceFile, classifierDiagnostic);

		return {
			classification,
			enhancedDiagnostic,
			file,
			inferenceJob: inferenceJobs[0],
		};
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
