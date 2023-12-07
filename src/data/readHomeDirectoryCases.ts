import { homedir } from 'os';
import { join } from 'path';
import { FileType, Uri, workspace } from 'vscode';
import { Case, CaseHash, caseHashCodec } from '../cases/types';
import { Job, JobKind, jobHashCodec } from '../jobs/types';
import EventEmitter from 'node:events';
import { MessageBus, MessageKind } from '../components/messageBus';
import { Store } from '.';
import {
	CaseReadingService,
	JOB_KIND,
	SurfaceAgnosticJob,
} from '@intuita-inc/utilities';
import { actions } from './slice';

interface CaseEventEmitter extends EventEmitter {
	emit(event: 'case'): boolean;
	emit(event: 'finish'): boolean;
	emit(event: 'error', error: Error): boolean;

	once(event: 'case', callback: () => void): this;
	once(event: 'finish', callback: () => void): this;
	once(event: 'error', callback: (error: Error) => void): boolean;
}

class CaseEventEmitter extends EventEmitter {}

export class HomeDirectoryService {
	protected readonly _caseEventEmitters: Map<string, CaseEventEmitter> =
		new Map();

	public constructor(
		private readonly __messageBus: MessageBus,
		private readonly __store: Store,
		private readonly __rootUri: Uri | null,
	) {
		__messageBus.subscribe(MessageKind.loadHomeDirectoryData, async () => {
			await this._handleLoadHomeDirectoryDataEvent();
		});

		__messageBus.subscribe(
			MessageKind.loadHomeDirectoryCase,
			async ({ caseHashDigest }) => {
				await this.__handleLoadHomeDirectoryCase(caseHashDigest);
			},
		);
	}

	protected async _handleLoadHomeDirectoryDataEvent() {
		if (!this.__rootUri) {
			return;
		}

		const casesDirectoryPath = join(homedir(), '.intuita', 'cases');

		try {
			const entries = await workspace.fs.readDirectory(
				Uri.file(casesDirectoryPath),
			);

			const directoryNames = entries.filter(
				([, fileType]) => fileType === FileType.Directory,
			);

			for (const [directoryName] of directoryNames) {
				const path = join(
					casesDirectoryPath,
					directoryName,
					'case.data',
				);

				if (this._caseEventEmitters.has(path)) {
					continue;
				}

				const caseEventEmitter = this._createEventEmitter(path);

				this._caseEventEmitters.set(path, caseEventEmitter);

				caseEventEmitter.once('finish', () => {
					this._caseEventEmitters.delete(path);
				});

				caseEventEmitter.once('error', (error) => {
					console.error(error);

					this._caseEventEmitters.delete(path);
				});
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async __handleLoadHomeDirectoryCase(caseHashDigest: CaseHash) {
		if (!this.__rootUri) {
			return;
		}

		const path = join(
			homedir(),
			'.intuita',
			'cases',
			caseHashDigest,
			'case.data',
		);

		if (this._caseEventEmitters.has(path)) {
			return;
		}

		const caseEventEmitter = this._createEventEmitter(path);

		this._caseEventEmitters.set(path, caseEventEmitter);

		caseEventEmitter.once('case', () => {
			this.__store.dispatch(actions.setActiveTabId('codemodRuns'));
			this.__store.dispatch(actions.setSelectedCaseHash(caseHashDigest));
		});

		caseEventEmitter.once('finish', () => {
			this._caseEventEmitters.delete(path);
		});

		caseEventEmitter.once('error', (error) => {
			console.error(error);

			this._caseEventEmitters.delete(path);
		});
	}

	protected _createEventEmitter(path: string): CaseEventEmitter {
		const caseEventEmitter = new CaseEventEmitter();

		const caseReadingService = new CaseReadingService(path);

		let kase: Case | null = null;

		caseReadingService.once('case', (surfaceAgnosticCase) => {
			console.log('emitting case');

			if (
				!this.__rootUri ||
				!surfaceAgnosticCase.absoluteTargetPath.startsWith(
					this.__rootUri.fsPath,
				)
			) {
				console.info(
					'The current case does not belong to the opened workspace',
				);
				caseReadingService.emit('finish');
				return;
			}

			if (!caseHashCodec.is(surfaceAgnosticCase.caseHashDigest)) {
				console.error('Could not validate the case hash digest');
				caseReadingService.emit('finish');
				return;
			}

			const codemodEntities = this.__store.getState().codemod.entities;

			const codemodName =
				codemodEntities[surfaceAgnosticCase.codemodHashDigest]?.name ??
				surfaceAgnosticCase.codemodHashDigest;

			kase = {
				hash: surfaceAgnosticCase.caseHashDigest,
				codemodName: `${codemodName} (CLI)`,
				createdAt: Number(surfaceAgnosticCase.createdAt),
				path: surfaceAgnosticCase.absoluteTargetPath,
			};

			this.__messageBus.publish({
				kind: MessageKind.upsertCase,
				kase,
				jobs: [],
			});

			caseEventEmitter.emit('case');
		});

		const jobHandler = (surfaceAgnosticJob: SurfaceAgnosticJob) => {
			console.log('emitting job');

			if (!kase) {
				console.error('You need to have a case to create a job');
				caseReadingService.emit('finish');
				return;
			}

			if (!jobHashCodec.is(surfaceAgnosticJob.jobHashDigest)) {
				console.error('Could not validate the job hash digest');
				caseReadingService.emit('finish');
				return;
			}

			if (surfaceAgnosticJob.kind === JOB_KIND.UPDATE_FILE) {
				const job: Job = {
					hash: surfaceAgnosticJob.jobHashDigest,
					originalNewContent: null,
					codemodName: kase.codemodName,
					createdAt: kase.createdAt,
					caseHashDigest: kase.hash,
					// variant
					kind: JobKind.rewriteFile,
					oldUri: Uri.file(surfaceAgnosticJob.pathUri),
					newContentUri: Uri.file(surfaceAgnosticJob.newDataUri),
					newUri: null,
				};

				this.__messageBus.publish({
					kind: MessageKind.upsertCase,
					kase,
					jobs: [job],
				});
			}

			// TODO implement more job kinds
		};

		caseReadingService.on('job', jobHandler);

		const TIMEOUT = 120_000;

		let timedOut = false;

		const timeout = setTimeout(() => {
			timedOut = true;

			caseReadingService.off('job', jobHandler);
			caseReadingService.emit('finish');

			caseEventEmitter.emit(
				'error',
				new Error(`Reading the case timed out after ${TIMEOUT}ms`),
			);
		}, TIMEOUT);

		caseReadingService.once('error', (error) => {
			if (timedOut) {
				return;
			}

			caseReadingService.off('job', jobHandler);

			clearTimeout(timeout);

			caseEventEmitter.emit('error', error);
		});

		caseReadingService.once('finish', () => {
			console.log('XXXXX');
			if (timedOut) {
				return;
			}

			caseReadingService.off('job', jobHandler);

			clearTimeout(timeout);

			if (kase === null) {
				caseEventEmitter.emit(
					'error',
					new Error('Could not extract the case'),
				);
				return;
			}

			caseEventEmitter.emit('finish');
		});

		caseReadingService.initialize().catch((error) => {
			clearTimeout(timeout);

			caseEventEmitter.emit('error', error);
		});

		return caseEventEmitter;
	}
}
