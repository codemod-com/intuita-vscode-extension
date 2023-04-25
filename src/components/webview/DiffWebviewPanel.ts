import { workspace, commands } from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import { JobDiffViewProps, View, WebviewResponse } from './webviewEvents';
import { JobHash, JobKind } from '../../jobs/types';
import { JobManager } from '../jobManager';
import { isNeitherNullNorUndefined } from '../../utilities';
import { ElementHash } from '../../elements/types';
import { CaseManager } from '../../cases/caseManager';
import { CaseHash } from '../../cases/types';
import { IntuitaWebviewPanel, Options } from './WebviewPanel';

const buildIssueTemplate = (codemodName: string): string => {
	return `
	**Codemod name**
	${codemodName}
	
	**Codemod input**
	Please provide a code example on which the codemod was executed
	
	**Expected codemod output**
	Provide expected codemod output
	
	**Actual codemod output**
	Provide actual codemod output
	
	**Additional context**
	Add any other context about the problem here.`;
};
export class DiffWebviewPanel extends IntuitaWebviewPanel {
	static instance: DiffWebviewPanel | null = null;

	static getInstance(
		options: Options,
		messageBus: MessageBus,
		jobManager: JobManager,
		caseManager: CaseManager,
		rootPath: string,
	) {
		if (!DiffWebviewPanel.instance) {
			DiffWebviewPanel.instance = new DiffWebviewPanel(
				options,
				messageBus,
				jobManager,
				caseManager,
				rootPath,
			);
		}

		return DiffWebviewPanel.instance;
	}

	private constructor(
		options: Options,
		messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
		public readonly __rootPath: string,
	) {
		super(options, messageBus);
	}

	_attachWebviewEventListeners() {
		this._panel?.webview.onDidReceiveMessage(
			this.__onDidReceiveMessage.bind(this),
		);
	}

	private __onDidReceiveMessage(message: WebviewResponse) {
		if (message.kind === 'webview.command') {
			commands.executeCommand(
				message.value.command,
				message.value.arguments,
			);
		}
		if (
			message.kind === 'intuita.rejectJob' ||
			message.kind === 'intuita.createIssue' ||
			message.kind === 'intuita.createPR' ||
			message.kind === 'intuita.acceptJob'
		) {
			commands.executeCommand(message.kind, message.value[0]);
		}

		if (message.kind === 'webview.global.reportIssue') {
			const job = this.__jobManager.getJob(message.faultyJobHash);

			if (!job) {
				throw new Error('Unable to get the job');
			}

			const queryParams = {
				title: `${job.codemodName} codemod produces invalid output`,
				body: buildIssueTemplate(job.codemodName),
				template: 'report-faulty-codemod.md',
			};

			const query = new URLSearchParams(queryParams).toString();

			commands.executeCommand(
				'intuita.redirect',
				`https://github.com/intuita-inc/intuita-vscode-extension/issues/new?${query}`,
			);
		}
	}

	public override dispose() {
		super.dispose();
		DiffWebviewPanel.instance = null;
	}

	public async getViewDataForJob(
		jobHash: JobHash,
	): Promise<JobDiffViewProps | null> {
		if (!this.__rootPath) {
			return null;
		}

		const job = this.__jobManager.getJob(jobHash);
		// @TODO
		const jobAccepted = this.__jobManager.isJobApplied(jobHash);

		if (!job) {
			return null;
		}

		const { oldUri, newUri, kind, oldContentUri, newContentUri } = job;

		const newFileTitle = newUri
			? newUri.fsPath.replace(this.__rootPath, '') ?? ''
			: null;
		const oldFileTitle = oldUri
			? oldUri.fsPath.replace(this.__rootPath, '') ?? ''
			: null;
		const newFileContent = newContentUri
			? (await workspace.fs.readFile(newContentUri)).toString()
			: null;
		const oldFileContent = oldContentUri
			? (await workspace.fs.readFile(oldContentUri)).toString()
			: null;
		const getTitle = function () {
			switch (kind) {
				case JobKind.createFile:
					return `${jobAccepted ? 'Created' : 'Create'}`;
				case JobKind.deleteFile:
					return `${jobAccepted ? 'Deleted' : 'Delete'}`;

				case JobKind.moveFile:
					return `${jobAccepted ? 'Moved' : 'Move'}`;

				case JobKind.moveAndRewriteFile:
					return `${
						jobAccepted ? 'Moved and rewritten' : 'Move and rewrite'
					}`;
				case JobKind.copyFile:
					return `${jobAccepted ? 'Copied' : 'Copy'}`;

				case JobKind.rewriteFile:
					return `${jobAccepted ? 'Rewritten' : 'Rewrite'}`;

				default:
					throw new Error('unknown jobkind');
			}
		};

		return {
			jobHash,
			jobKind: kind,
			...(oldFileTitle &&
			[
				JobKind.moveFile,
				JobKind.moveAndRewriteFile,
				JobKind.copyFile,
			].includes(kind)
				? { oldFileTitle }
				: { oldFileTitle: null }),
			newFileTitle,
			...(oldFileContent &&
			[
				JobKind.rewriteFile,
				JobKind.deleteFile,
				JobKind.moveAndRewriteFile,
				JobKind.moveFile,
			].includes(kind)
				? { oldFileContent }
				: { oldFileContent: null }),
			newFileContent,
			title: getTitle(),
			actions: [],
		};
	}

	public async getViewDataForCase(
		caseHash: ElementHash,
	): Promise<null | Readonly<{ title: string; data: JobDiffViewProps[] }>> {
		const hash = caseHash as unknown as CaseHash;
		const kase = this.__caseManager.getCase(hash);
		if (!kase) {
			return null;
		}
		const jobHashes = Array.from(
			this.__caseManager.getJobHashes([hash] as unknown as CaseHash[]),
		);

		if (jobHashes.length === 0) {
			return null;
		}
		const viewDataArray = await Promise.all(
			jobHashes.map((jobHash) => this.getViewDataForJob(jobHash)),
		);
		return {
			title: kase.codemodName,
			data: viewDataArray.filter(isNeitherNullNorUndefined),
		};
	}

	public async getViewDataForJobsArray(
		jobHashes: JobHash[],
	): Promise<Readonly<JobDiffViewProps>[]> {
		if (jobHashes.length === 0) {
			return [];
		}
		const viewDataArray = await Promise.all(
			jobHashes.map((jobHash) => this.getViewDataForJob(jobHash)),
		);
		return viewDataArray.filter(isNeitherNullNorUndefined);
	}

	public setView(data: View) {
		this._panel?.webview.postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	private __onUpdateJobMessage = async (jobHashes: ReadonlySet<JobHash>) => {
		for (const jobHash of Array.from(jobHashes)) {
			const props = await this.getViewDataForJob(jobHash);
			if (!props) continue;
			this._postMessage({
				kind: 'webview.diffView.updateDiffViewProps',
				data: props,
			});
		}
	};

	private __onRejectJob = async (jobHashes: ReadonlySet<JobHash>) => {
		for (const jobHash of jobHashes) {
			this._postMessage({
				kind: 'webview.diffview.rejectedJob',
				data: [jobHash],
			});
		}
	};

	_attachExtensionEventListeners() {
		this._addHook(MessageKind.jobsAccepted, (message) => {
			this.__onUpdateJobMessage(message.deletedJobHashes);
		});

		this._addHook(MessageKind.jobsRejected, (message) => {
			this.__onRejectJob(message.deletedJobHashes);
		});
	}
}
