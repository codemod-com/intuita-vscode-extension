import {
	workspace,
	commands,
} from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import {
	JobDiffViewProps,
	View,
	WebviewResponse,
} from './webviewEvents';
import { JobHash, JobKind } from '../../jobs/types';
import { JobManager } from '../jobManager';
import { isNeitherNullNorUndefined } from '../../utilities';
import { ElementHash } from '../../elements/types';
import { CaseManager } from '../../cases/caseManager';
import { CaseHash } from '../../cases/types';
import { IntuitaWebviewPanel, Options } from './WebviewPanel';

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
		super(options, messageBus)
	}

	_attachWebviewEventListeners() {
		this._panel?.webview.onDidReceiveMessage(this.__onDidReceiveMessage);
	}
	
	private __onDidReceiveMessage(message: WebviewResponse) {
		if (message.kind === 'webview.command') {
			commands.executeCommand(
				message.value.command,
				message.value.arguments,
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
		const jobAccepted = this.__jobManager.isJobAccepted(jobHash);
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
					return `${
						jobAccepted ? 'Created' : 'Create'
					} file ${newFileTitle}`;
				case JobKind.deleteFile:
					return `${
						jobAccepted ? 'Deleted' : 'Delete'
					} file ${oldFileTitle}`;

				case JobKind.moveFile:
					return `${
						jobAccepted ? 'Moved' : 'Move'
					} file ${oldFileTitle} to ${newFileTitle}`;

				case JobKind.moveAndRewriteFile:
					return `${
						jobAccepted ? 'Moved and rewritten' : 'Move and rewrite'
					} file ${oldFileTitle} to ${newFileTitle}`;

				case JobKind.copyFile:
					return `${
						jobAccepted ? 'Copied' : 'Copy'
					} file ${oldFileTitle} to ${newFileTitle}`;

				case JobKind.rewriteFile:
					return `${
						jobAccepted ? 'Rewritten' : 'Rewrite'
					} file ${oldFileTitle}`;

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
			oldFileContent,
			newFileContent,
			title: getTitle(),
		};
	}

	public async getViewDataForCase(
		caseHash: ElementHash,
	): Promise<Readonly<JobDiffViewProps>[]> {
		const jobHashes = Array.from(
			this.__caseManager.getJobHashes([
				caseHash,
			] as unknown as CaseHash[]),
		);

		if (jobHashes.length === 0) {
			return [];
		}
		const viewDataArray = await Promise.all(
			jobHashes.map((jobHash) => this.getViewDataForJob(jobHash)),
		);
		return viewDataArray.filter(isNeitherNullNorUndefined);
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

	_attachExtensionEventListeners() {
		this._addHook(MessageKind.jobsAccepted, (message) => {
			this.__onUpdateJobMessage(message.deletedJobHashes);
		});
	}
}
