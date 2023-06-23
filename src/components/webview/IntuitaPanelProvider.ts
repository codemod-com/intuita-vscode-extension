import { readFileSync } from 'fs';
import { Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import type { RootState, Store } from '../../data';
import { JobHash, JobKind, mapPersistedJobToJob } from '../../jobs/types';
import { WebviewResolver } from './WebviewResolver';
import areEqual from 'fast-deep-equal';
import { PanelViewProps } from './panelViewProps';
import { LeftRightHashSetManager } from '../../leftRightHashes/leftRightHashSetManager';
import { CaseHash } from '../../cases/types';
import { WebviewMessage } from './webviewEvents';

const TYPE = 'intuitaPanel';
const WEBVIEW_NAME = 'jobDiffView';

const selectViewProps = (
	state: RootState,
	rootPath: string,
): PanelViewProps | null => {
	const { selectedCaseHash } = state.codemodRunsView;
	const { focusedJobHash } = state.changeExplorerView;

	if (selectedCaseHash === null || focusedJobHash === null) {
		return null;
	}

	const persistedJob = state.job.entities[focusedJobHash] ?? null;

	if (persistedJob === null) {
		return null;
	}

	const caseJobManager = new LeftRightHashSetManager<CaseHash, JobHash>(
		new Set(state.caseHashJobHashes),
	);

	const jobCount =
		caseJobManager.getRightHashesByLeftHash(selectedCaseHash).size;

	const job = mapPersistedJobToJob(persistedJob);

	const newFileTitle = job.newUri?.fsPath.replace(rootPath, '') ?? null;
	const oldFileTitle =
		[
			JobKind.moveFile,
			JobKind.moveAndRewriteFile,
			JobKind.copyFile,
		].includes(job.kind) && job.oldUri
			? job.oldUri.fsPath.replace(rootPath, '')
			: null;

	const newFileContent =
		job.newContentUri !== null
			? readFileSync(job.newContentUri.fsPath).toString('utf8')
			: null;

	const oldFileContent =
		job.oldUri !== null &&
		[
			JobKind.rewriteFile,
			JobKind.deleteFile,
			JobKind.moveAndRewriteFile,
			JobKind.moveFile,
		].includes(job.kind)
			? readFileSync(job.oldUri.fsPath).toString('utf8')
			: null;

	return {
		kind: 'JOB',
		title: newFileTitle ?? oldFileTitle ?? '',
		caseHash: selectedCaseHash,
		jobHash: job.hash,
		jobKind: job.kind,
		oldFileTitle,
		newFileTitle,
		oldFileContent,
		newFileContent,
		jobCount,
	};
};

export class IntuitaPanelProvider {
	private __webviewPanel: WebviewPanel | null = null;

	public constructor(
		private readonly __extensionUri: Uri,
		store: Store,
		rootPath: string,
	) {
		let prevViewProps = selectViewProps(store.getState(), rootPath);

		store.subscribe(async () => {
			const nextViewProps = selectViewProps(store.getState(), rootPath);

			if (areEqual(prevViewProps, nextViewProps)) {
				return;
			}

			prevViewProps = nextViewProps;

			if (nextViewProps !== null) {
				await this.__upsertPanel(nextViewProps, true);
			} else {
				this.__disposePanel();
			}
		});
	}

	private async __upsertPanel(
		panelViewProps: PanelViewProps,
		preserveFocus: boolean,
	) {
		if (this.__webviewPanel === null) {
			const webviewResolver = new WebviewResolver(this.__extensionUri);
			this.__webviewPanel = window.createWebviewPanel(
				TYPE,
				panelViewProps.title,
				{
					viewColumn: ViewColumn.One,
					preserveFocus,
				},
				webviewResolver.getWebviewOptions(),
			);

			webviewResolver.resolveWebview(
				this.__webviewPanel.webview,
				WEBVIEW_NAME,
				JSON.stringify(panelViewProps),
				'panelViewProps',
			);

			this.__webviewPanel.onDidDispose(() => {
				this.__webviewPanel = null;
			});

			return;
		}

		this.__webviewPanel.title = panelViewProps.title;
		await this.__webviewPanel.webview.postMessage({
			kind: 'webview.setPanelViewProps',
			panelViewProps,
		} satisfies WebviewMessage);
		this.__webviewPanel.reveal(undefined, preserveFocus);
	}

	private __disposePanel() {
		this.__webviewPanel?.dispose();

		this.__webviewPanel = null;
	}
}
