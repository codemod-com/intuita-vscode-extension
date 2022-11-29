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
import FormData from 'form-data';
import { buildUriHash } from '../uris/buildUriHash';
import { UriHash } from '../uris/types';
import { buildCases } from '../classifier/buildCases';
import { CaseManager } from '../cases/caseManager';
import { JobIngredients } from '../classifier/types';
import { buildClassifierDiagnostic } from '../classifier/buildClassifierDiagnostic';
import { classify } from '../classifier/classify';
import { File } from '../files/types';

export class InferredCodeRepairService {
	readonly #caseManager: CaseManager;
	readonly #configurationContainer: Container<Configuration>;
	readonly #messageBus: MessageBus;
	readonly #cancelTokenSourceMap: Map<UriHash, CancelTokenSource> = new Map();

	public constructor(
		readonly caseManager: CaseManager,
		readonly configurationContainer: Container<Configuration>,
		readonly messageBus: MessageBus,
	) {
		this.#caseManager = caseManager;
		this.#configurationContainer = configurationContainer;
		this.#messageBus = messageBus;

		this.#messageBus.subscribe((message) => {
			if (message.kind === MessageKind.externalFileUpdated) {
				setImmediate(() => {
					this.#onExternalFileUpdatedMessage(message.uri);
				});
			}

			if (message.kind === MessageKind.externalDiagnostics) {
				setImmediate(() => {
					this.#onExternalDiagnosticsMessage(message);
				});
			}
		});
	}

	#cancel(uriHash: UriHash) {
		const cancelTokenSource = this.#cancelTokenSourceMap.get(uriHash);

		if (!cancelTokenSource) {
			return;
		}

		this.#cancelTokenSourceMap.delete(uriHash);

		cancelTokenSource.cancel();
	}

	#onExternalFileUpdatedMessage(uri: Uri): void {
		this.#cancel(buildUriHash(uri));
	}

	async #onExternalDiagnosticsMessage(
		message: Message & { kind: MessageKind.externalDiagnostics },
	): Promise<void> {
		// TODO remove
		return;

		const jobIngredients = await Promise.all(
			message.enhancedDiagnostics.map((enhancedDiagnostic) =>
				this.#buildJobIngredients(
					message.uriHashFileMap,
					enhancedDiagnostic,
				),
			),
		);

		const { casesWithJobHashes, jobs } = buildCases(
			this.#caseManager.getCasesWithJobHashes(),
			jobIngredients,
		);

		this.#messageBus.publish({
			kind: MessageKind.upsertCases,
			uriHashFileMap: message.uriHashFileMap,
			casesWithJobHashes,
			jobs,
			inactiveDiagnosticHashes: message.inactiveDiagnosticHashes,
			inactiveJobHashes: new Set(),
			trigger: message.trigger,
		});
	}

	async #buildJobIngredients(
		uriHashFileMap: ReadonlyMap<UriHash, File>,
		enhancedDiagnostic: EnhancedDiagnostic,
	): Promise<JobIngredients> {
		const uriHash = buildUriHash(enhancedDiagnostic.uri);
		const file = uriHashFileMap.get(uriHash) ?? null;

		if (file === null) {
			throw new Error('Could not find a File for the provided uriHash');
		}

		this.#cancel(uriHash);

		const source = Axios.CancelToken.source();

		this.#cancelTokenSourceMap.set(uriHash, source);

		const lineNumbers = [enhancedDiagnostic.diagnostic.range.start.line];

		const response = await this.#infer(
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
			replacementEnvelope: inferenceJobs[0],
		};
	}

	async #infer(
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
