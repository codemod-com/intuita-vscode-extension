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
	private __selectedCaseHash: ElementHash | null = null;

	constructor(
		options: Options,
		messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		private readonly __caseManager: CaseManager,
		public readonly __rootPath: string | null,
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

		if (message.kind === 'webview.global.focusView') {
			commands.executeCommand('intuita.focusView', message.webviewName);
		}

		if (
			message.kind === 'intuita.rejectJob' ||
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

		if (message.kind === 'webview.global.showInformationMessage') {
			window.showInformationMessage(message.value);
		}
	}

	public async openCase(caseHash: ElementHash): Promise<void> {
		this.__selectedCaseHash = caseHash;
		await this.__refreshView();
	}

	public override dispose() {
		super.dispose();
		this.__selectedCaseHash = null;
	}

	public async getViewDataForJob(
		jobHash: JobHash,
	): Promise<JobDiffViewProps | null> {
		if (!this.__rootPath) {
			return null;
		}

		const job = this.__jobManager.getJob(jobHash);
		// @TODO

		if (!job) {
			return null;
		}

		const { oldUri, newUri, kind, newContentUri } = job;

		const newFileTitle = newUri
			? newUri.fsPath.replace(this.__rootPath, '') ?? ''
			: null;
		const oldFileTitle = oldUri
			? oldUri.fsPath.replace(this.__rootPath, '') ?? ''
			: null;
		const newFileContent = newContentUri
			? (await workspace.fs.readFile(newContentUri)).toString()
			: null;
		const oldFileContent = oldUri
			? (await workspace.fs.readFile(oldUri)).toString()
			: null;

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
		};
	}

	public async getViewDataForCase(
		caseHash: ElementHash,
	): Promise<null | Readonly<{
		title: string;
		data: JobDiffViewProps[];
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

		this.__selectedCaseHash = caseHash;

		const data = viewDataArray.filter(isNeitherNullNorUndefined);

		return {
			title: `${kase.codemodName} (${data.length})`,
			data,
		};
	}

	public setView(data: View) {
		this._panel?.webview.postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	public focusView() {
		this._panel?.webview.postMessage({
			kind: 'webview.global.focusView',
		});
	}

	public focusFile(jobHash: JobHash) {
		this._panel?.webview.postMessage({
			kind: 'webview.diffView.focusFile',
			jobHash,
		});
	}

	async __refreshView(): Promise<void> {
		if (this.__selectedCaseHash === null) {
			return;
		}

		await this.createOrShowPanel();

		const viewData = await this.getViewDataForCase(this.__selectedCaseHash);

		if (viewData === null) {
			return;
		}

		const { title, data } = viewData;

		const view: View = {
			viewId: 'jobDiffView' as const,
			viewProps: {
				loading: false,
				diffId: this.__selectedCaseHash as string,
				title,
				data,
			},
		};

		this.setTitle(title);
		this.setView(view);
	}

	_attachExtensionEventListeners() {
		this._addHook(MessageKind.codemodSetExecuted, () => {
			this.__refreshView();
		});

		this._addHook(MessageKind.configurationChanged, () => {
			this.__refreshView();
		});

		this._addHook(MessageKind.clearState, () => {
			this.dispose();
		});

		this._addHook(MessageKind.focusFile, async ({ caseHash, jobHash }) => {
			await this.openCase(caseHash as unknown as ElementHash);
			this.focusFile(jobHash);
		});
	}
}
