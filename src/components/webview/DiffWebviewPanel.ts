import { workspace } from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import { JobDiffViewProps, View } from './webviewEvents';
import { JobHash, JobKind } from '../../jobs/types';
import { JobManager } from '../jobManager';
import { IntuitaWebviewPanel, Options } from './WebviewPanel';

export class DiffWebviewPanel extends IntuitaWebviewPanel {
	static instance: DiffWebviewPanel | null = null;

	static getInstance(
		options: Options,
		messageBus: MessageBus,
		jobManager: JobManager,
		rootPath: string,
	) {
		if (!DiffWebviewPanel.instance) {
			DiffWebviewPanel.instance = new DiffWebviewPanel(
				options,
				messageBus,
				jobManager,
				rootPath,
			);
		}

		return DiffWebviewPanel.instance;
	}

	private constructor(
		options: Options,
		messageBus: MessageBus,
		private readonly __jobManager: JobManager,
		public readonly __rootPath: string,
	) {
		super(options, messageBus);
	}

	public dispose() {
		super.dispose();
		DiffWebviewPanel.instance = null;
	}

	public async getViewData(
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
						jobAccepted
							? 'Moved and re-written'
							: 'Move and rewrite'
					} file ${oldFileTitle} to ${newFileTitle}`;

				case JobKind.copyFile:
					return `${
						jobAccepted ? 'Copied' : 'Copy'
					} file ${oldFileTitle} to ${newFileTitle}`;

				case JobKind.rewriteFile:
					return `${
						jobAccepted ? 'Re-written' : 'Rewrite'
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

	public setView(data: View) {
		this.__panel?.webview.postMessage({
			kind: 'webview.global.setView',
			value: data,
		});
	}

	private __onUpdateJobMessage = async (jobHashes: ReadonlySet<JobHash>) => {
		for (const jobHash of Array.from(jobHashes)) {
			const props = await this.getViewData(jobHash);
			if (!props) continue;
			this.__postMessage({
				kind: 'webview.diffView.updateDiffViewProps',
				data: props,
			});
		}
	};

	__attachExtensionEventListeners() {
		this.__addHook(MessageKind.jobsAccepted, (message) => {
			this.__onUpdateJobMessage(message.deletedJobHashes);
		});
	}
}
