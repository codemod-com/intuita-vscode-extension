import { createReadStream } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { FileType, Uri, workspace } from 'vscode';
import { readSurfaceAgnosticCase } from './readSurfaceAgnosticCase';
import { Case, caseHashCodec } from '../cases/types';
import { Job, JobKind, jobHashCodec } from '../jobs/types';
import { parseSurfaceAgnosticCase } from './schemata/surfaceAgnosticCaseSchema';
import {
	JOB_KIND,
	parseSurfaceAgnosticJob,
} from './schemata/surfaceAgnosticJobSchema';
import { CodemodEntry } from '../codemods/types';
import EventEmitter from 'events';
import { MessageBus, MessageKind } from '../components/messageBus';
import { Store } from '.';

interface HomeDirectoryEventEmitter extends EventEmitter {
	emit(event: 'start'): boolean;
	emit(event: 'end'): boolean;
	emit(event: 'job', kase: Case, jobs: ReadonlyArray<Job>): boolean;

	once(event: 'start', listener: () => void): this;
	once(event: 'end', listener: () => void): this;
	on(
		event: 'job',
		listener: (kase: Case, jobs: ReadonlyArray<Job>) => void,
	): this;
}

const readHomeDirectoryCase = async (
	homeDirectoryEventEmitter: HomeDirectoryEventEmitter,
	rootUri: Uri,
	codemodEntities: Record<string, CodemodEntry | undefined>,
	caseDataPath: string,
) => {
	const readStream = createReadStream(caseDataPath);

	await new Promise<void>((resolve, reject) => {
		let timedOut = false;

		const timeout = setTimeout(() => {
			timedOut = true;
			reject(
				`Opening the read stream for ${caseDataPath} timed out after 1s.`,
			);
		}, 1000);

		readStream.once('open', () => {
			if (timedOut) {
				return;
			}

			clearTimeout(timeout);
			resolve();
		});
	});

	let kase: Case | null = null;

	const fileEventEmitter = readSurfaceAgnosticCase(readStream);

	fileEventEmitter.once('case', (data: unknown) => {
		const surfaceAgnosticCase = parseSurfaceAgnosticCase(data);

		if (
			!surfaceAgnosticCase.absoluteTargetPath.startsWith(rootUri.fsPath)
		) {
			console.info(
				'The current case does not belong to the opened workspace',
			);
			fileEventEmitter.emit('close');
			return;
		}

		if (!caseHashCodec.is(surfaceAgnosticCase.caseHashDigest)) {
			console.error('Could not validate the case hash digest');
			fileEventEmitter.emit('close');
			return;
		}

		const codemodName =
			codemodEntities[surfaceAgnosticCase.codemodHashDigest]?.name ??
			surfaceAgnosticCase.codemodHashDigest;

		kase = {
			hash: surfaceAgnosticCase.caseHashDigest,
			codemodName: `${codemodName} (CLI)`,
			createdAt: Number(surfaceAgnosticCase.createdAt),
			path: surfaceAgnosticCase.absoluteTargetPath,
		};

		homeDirectoryEventEmitter.emit('job', kase, []);
	});

	const jobHandler = (data: unknown) => {
		const surfaceAgnosticJob = parseSurfaceAgnosticJob(data);

		if (!kase) {
			console.error('You need to have a case to create a job');
			fileEventEmitter.emit('close');
			return;
		}

		if (!jobHashCodec.is(surfaceAgnosticJob.jobHashDigest)) {
			console.error('Could not validate the job hash digest');
			fileEventEmitter.emit('close');
			return;
		}

		if (surfaceAgnosticJob.kind === JOB_KIND.REWRITE_FILE) {
			const job: Job = {
				hash: surfaceAgnosticJob.jobHashDigest,
				originalNewContent: null,
				codemodName: kase.codemodName,
				createdAt: kase.createdAt,
				caseHashDigest: kase.hash,
				// variant
				kind: JobKind.rewriteFile,
				oldUri: Uri.file(surfaceAgnosticJob.oldUri),
				newContentUri: Uri.file(surfaceAgnosticJob.newUri),
				newUri: null,
			};

			homeDirectoryEventEmitter.emit('job', kase, [job]);
		}

		// TODO implement more job kinds
	};

	fileEventEmitter.on('job', jobHandler);

	const TIMEOUT = 120_000;

	return new Promise<void>((resolve, reject) => {
		let timedOut = false;

		const timeout = setTimeout(() => {
			timedOut = true;

			fileEventEmitter.off('job', jobHandler);
			fileEventEmitter.emit('close');

			reject(new Error(`Reading the case timed out after ${TIMEOUT}ms`));
		}, TIMEOUT);

		fileEventEmitter.once('error', (error) => {
			if (timedOut) {
				return;
			}

			fileEventEmitter.off('job', jobHandler);

			clearTimeout(timeout);
			reject(error);
		});

		fileEventEmitter.once('end', () => {
			if (timedOut) {
				return;
			}

			fileEventEmitter.off('job', jobHandler);

			clearTimeout(timeout);

			if (kase === null) {
				reject(new Error('Could not extract the case'));
				return;
			}

			resolve();
		});
	});
};

export const readHomeDirectoryCases = async (
	rootUri: Uri,
	codemodEntities: Record<string, CodemodEntry | undefined>,
): Promise<HomeDirectoryEventEmitter | null> => {
	if (rootUri === null) {
		return null;
	}

	const eventEmitter: HomeDirectoryEventEmitter = new EventEmitter();

	eventEmitter.once('start', async () => {
		const casesDirectoryPath = join(homedir(), '.intuita', 'cases');

		const casesDirectoryUri = Uri.file(casesDirectoryPath);

		try {
			const entries = await workspace.fs.readDirectory(casesDirectoryUri);

			const caseDataPaths = entries
				.filter(([, fileType]) => fileType === FileType.Directory)
				.map(([name]) => join(casesDirectoryPath, name, 'case.data'));

			await Promise.allSettled(
				caseDataPaths.map((path) =>
					readHomeDirectoryCase(
						eventEmitter,
						rootUri,
						codemodEntities,
						path,
					),
				),
			);
		} catch (error) {
			console.error(error);
		}

		eventEmitter.emit('end');
	});

	return eventEmitter;
};

export class HomeDirectoryService {
	public constructor(
		private readonly __messageBus: MessageBus,
		private readonly __store: Store,
		private readonly __rootUri: Uri | null,
	) {
		__messageBus.subscribe(MessageKind.loadHomeDirectoryData, async () => {
			if (!this.__rootUri) {
				return;
			}

			const eventEmitter = await readHomeDirectoryCases(
				this.__rootUri,
				this.__store.getState().codemod.entities,
			);

			const jobHandler = (kase: Case, jobs: ReadonlyArray<Job>) => {
				this.__messageBus.publish({
					kind: MessageKind.upsertCase,
					kase,
					jobs,
				});
			};

			eventEmitter?.once('end', () => {
				eventEmitter.off('job', jobHandler);
			});

			eventEmitter?.on('job', jobHandler);

			eventEmitter?.emit('start');
		});
	}
}
