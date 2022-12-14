import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Uri } from 'vscode';
import * as readline from 'node:readline';
import { EngineMessageKind, messageCodec } from './engineService';
import prettyReporter from 'io-ts-reporters';
import { Message, MessageBus, MessageKind } from './messageBus';
import { CaseKind, CaseWithJobHashes } from '../cases/types';
import { buildCaseHash } from '../cases/buildCaseHash';
import { Job, JobHash, JobKind, RewriteFileJob } from '../jobs/types';

class CompareProcessWrapper {
	#exited = false;
	readonly #process: ChildProcessWithoutNullStreams;

	constructor(executableUri: Uri, messageBus: MessageBus) {
		this.#process = spawn(executableUri.fsPath, [], {
			stdio: 'pipe',
		});

		this.#process.on('error', (error) => {
			console.error(error);

			this.#exited = true;
		});

		this.#process.on('exit', () => {
			this.#exited = true;
		});

		const interfase = readline.createInterface(this.#process.stdout);

		interfase.on('line', async (line) => {
			const either = messageCodec.decode(JSON.parse(line));

			if (either._tag === 'Left') {
				const report = prettyReporter.report(either);

				console.error(report);
				return;
			}

			const message = either.right;

			if (message.k === EngineMessageKind.compare) {
				messageBus.publish({
					kind: MessageKind.filesCompared,
					jobHash: message.i as JobHash,
					equal: message.e,
				});
			}
		});
	}

	isExited(): boolean {
		return this.#exited;
	}

	write(job: RewriteFileJob) {
		const leftUri = job.inputUri;
		const rightUri = job.outputUri;

		const data = JSON.stringify({
			k: 5,
			i: job.hash,
			l: leftUri.fsPath,
			r: rightUri.fsPath,
		});

		this.#process.stdin.write(data + '\n', (error) => {
			if (error) {
				console.error(error);
			}
		});
	}

	kill() {
		// TODO this needs to be executed once we close the extension
		this.#process.kill();
	}
}

export class NoraCompareServiceEngine {
	#compareProcessWrapper: CompareProcessWrapper | null = null;
	#messageBus: MessageBus;
	#jobMap: Map<JobHash, [Job, CaseKind, string]> = new Map();

	constructor(messageBus: MessageBus) {
		this.#messageBus = messageBus;

		this.#messageBus.subscribe((message) => {
			if (message.kind === MessageKind.compareFiles) {
				setImmediate(() => {
					this.onCompareFilesMessage(message);
				});
			}

			if (message.kind === MessageKind.filesCompared) {
				setImmediate(() => {
					this.onFilesComparedMessage(message);
				});
			}
		});
	}

	onCompareFilesMessage(
		message: Message & { kind: MessageKind.compareFiles },
	) {
		if (
			!this.#compareProcessWrapper ||
			this.#compareProcessWrapper.isExited()
		) {
			const executableUri = Uri.file(
				'/intuita/nora-rust-engine/target/release/nora-rust-engine',
			);

			this.#compareProcessWrapper = new CompareProcessWrapper(
				executableUri,
				this.#messageBus,
			);
		}

		const { job, caseKind, caseSubKind } = message;

		this.#jobMap.set(job.hash, [job, caseKind, caseSubKind]);

		if (job.kind === JobKind.rewriteFile) {
			this.#compareProcessWrapper.write(job);
		} else {
			this.#messageBus.publish({
				kind: MessageKind.filesCompared,
				jobHash: job.hash,
				equal: false,
			});
		}
	}

	onFilesComparedMessage(
		message: Message & { kind: MessageKind.filesCompared },
	) {
		if (message.equal) {
			return;
		}

		const { jobHash } = message;

		const tuple = this.#jobMap.get(jobHash);

		if (!tuple) {
			throw new Error();
		}

		const [job, caseKind, caseSubKind] = tuple;

		const kase = {
			kind: caseKind,
			subKind: caseSubKind,
		} as const;

		const caseWithJobHashes: CaseWithJobHashes = {
			hash: buildCaseHash(kase),
			kind: caseKind,
			subKind: caseSubKind,
			jobHashes: new Set([job.hash]),
		};

		this.#messageBus.publish({
			kind: MessageKind.upsertCases,
			casesWithJobHashes: [caseWithJobHashes],
			jobs: [job],
			inactiveJobHashes: new Set(),
			trigger: 'onCommand',
		});
	}
}
