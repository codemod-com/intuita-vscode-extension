import { workspace, commands, window } from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import { JobDiffViewProps, View, WebviewResponse } from './webviewEvents';
import { JobHash, JobKind } from '../../jobs/types';
import { JobManager } from '../jobManager';
import { isNeitherNullNorUndefined } from '../../utilities';
import { ElementHash } from '../../elements/types';
import { CaseManager } from '../../cases/caseManager';
import { CaseHash } from '../../cases/types';
import { IntuitaWebviewPanel, Options } from './WebviewPanel';
import { getConfiguration } from '../../configuration';

const buildIssueTemplate = (codemodName: string): string => {
	return `
---
:warning::warning: Please do not include any proprietary code in the issue. :warning::warning:

---
Codemod: ${codemodName}

**1. Code before transformation (Input for codemod)**
	
**2. Expected code after transformation (Desired output of codemod)**

**3. Faulty code obtained after running the current version of the codemod (Actual output of codemod)**

---	
**Additional context**`;
};
export class DiffWebviewPanel extends IntuitaWebviewPanel {
	private __openedCaseHash: ElementHash | null = null;

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
				title: `[Codemod][${job.codemodName}] Invalid codemod output`,
				body: buildIssueTemplate(job.codemodName),
				template: 'report-faulty-codemod.md',
			};

			const query = new URLSearchParams(queryParams).toString();

			commands.executeCommand(
				'intuita.redirect',
				`https://github.com/intuita-inc/codemod-registry/issues/new?${query}`,
			);
		}

		if (message.kind === 'webview.global.navigateToCommitView') {
			commands.executeCommand(
				'intuita.sourceControl.commitStagedJobs',
				message,
			);
		}

		if (message.kind === 'webview.global.applySelected') {
			commands.executeCommand(
				'intuita.sourceControl.saveStagedJobsToTheFileSystem',
				message,
			);
		}

		if (message.kind === 'webview.global.closeView') {
			this.dispose();
		}

		if (message.kind === 'webview.global.discardChanges') {
			commands.executeCommand('intuita.rejectCase', message.caseHash);
		}

		if (message.kind === 'webview.global.stageJobs') {
			this.__jobManager.setAppliedJobs(message.jobHashes);
			this.__onUpdateStagedJobsMessage();
		}

		if (message.kind === 'webview.global.openConfiguration') {
			commands.executeCommand(
				'workbench.action.openSettings',
				'@ext:Intuita.intuita-vscode-extension',
			);
		}

		if (message.kind === 'webview.global.showInformationMessage') {
			window.showInformationMessage(message.value);
		}
	}

	public override dispose() {
		super.dispose();
		DiffWebviewPanel.instance = null;
		this.__openedCaseHash = null;
	}

	public async getViewDataForJob(
		jobHash: JobHash,
	): Promise<(JobDiffViewProps & { staged: boolean }) | null> {
		if (!this.__rootPath) {
			return null;
		}

		const job = this.__jobManager.getJob(jobHash);
		// @TODO

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

		const jobStaged = this.__jobManager.isJobApplied(job.hash);

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
			title: newFileTitle,
			actions: [],
			staged: jobStaged,
		};
	}

	public async getViewDataForCase(
		caseHash: ElementHash,
	): Promise<null | Readonly<{
		title: string;
		data: JobDiffViewProps[];
		stagedJobs: JobHash[];
	}>> {
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

		this.__openedCaseHash = caseHash;

		const data = viewDataArray.filter(isNeitherNullNorUndefined);
		const stagedJobs = data
			.filter((job) => job.staged)
			.map((job) => job.jobHash);

		return {
			title: `${kase.codemodName} (${data.length})`,
			data,
			stagedJobs: stagedJobs,
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

	public focusFile(jobHash: JobHash) {
		this._panel?.webview.postMessage({
			kind: 'webview.diffView.focusFile',
			jobHash,
		});
	}

	public focusFolder(folderPath: string) {
		this._panel?.webview.postMessage({
			kind: 'webview.diffView.focusFolder',
			folderPath,
		});
	}

	async __onUpdateStagedJobsMessage(): Promise<void> {
		if (this.__openedCaseHash === null) {
			return;
		}

		const viewData = await this.getViewDataForCase(this.__openedCaseHash);

		if (viewData === null) {
			return;
		}

		const { stagedJobs } = viewData;
		this._postMessage({
			kind: 'webview.diffView.updateStagedJobs',
			value: stagedJobs,
		});
	}

	async __refreshView(): Promise<void> {
		if (this.__openedCaseHash === null) {
			return;
		}

		const viewData = await this.getViewDataForCase(this.__openedCaseHash);

		if (viewData === null) {
			return;
		}

		const { title, data, stagedJobs } = viewData;
		const { onDryRunCompleted } = getConfiguration();
		const showHooksCTA = onDryRunCompleted === null;

		const view: View = {
			viewId: 'jobDiffView' as const,
			viewProps: {
				showHooksCTA,
				loading: false,
				diffId: this.__openedCaseHash as string,
				title,
				data,
				stagedJobs,
			},
		};

		this.setTitle(title);
		this.setView(view);
	}

	_attachExtensionEventListeners() {
		this._addHook(MessageKind.afterDryRunHooksExecuted, () => {
			this.__refreshView();
		});

		this._addHook(MessageKind.codemodSetExecuted, () => {
			this.__refreshView();
		});

		this._addHook(MessageKind.configurationChanged, () => {
			this.__refreshView();
		});

		this._addHook(MessageKind.clearState, () => {
			this.dispose();
		});
	}
}
