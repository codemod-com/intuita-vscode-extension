import { readFileSync } from 'fs';
import { commands, Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import type { RootState, Store } from '../../data';
import { JobHash, JobKind, mapPersistedJobToJob } from '../../jobs/types';
import { WebviewResolver } from './WebviewResolver';
import areEqual from 'fast-deep-equal';
import { PanelViewProps } from './panelViewProps';
import { LeftRightHashSetManager } from '../../leftRightHashes/leftRightHashSetManager';
import { CaseHash } from '../../cases/types';
import { WebviewMessage, WebviewResponse } from './webviewEvents';
import { isNeitherNullNorUndefined } from '../../utilities';
import { comparePersistedJobs } from '../../selectors/comparePersistedJobs';
import { actions } from '../../data/slice';

const TYPE = 'intuitaPanel';
const WEBVIEW_NAME = 'jobDiffView';

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

const selectPanelViewProps = (
	state: RootState,
	rootPath: string,
): PanelViewProps | null => {
	const { selectedCaseHash } = state.codemodRunsView;
	const { focusedJobHash } = state.changeExplorerView;

	if (selectedCaseHash === null || focusedJobHash === null) {
		return null;
	}

	const caseJobManager = new LeftRightHashSetManager<CaseHash, JobHash>(
		new Set(state.caseHashJobHashes),
	);

	const jobs = Array.from(
		caseJobManager.getRightHashesByLeftHash(selectedCaseHash),
	)
		.map((jobHash) => state.job.entities[jobHash])
		.filter(isNeitherNullNorUndefined)
		.sort(comparePersistedJobs);

	const jobIndex = jobs.findIndex((job) => job.hash === focusedJobHash);
	const jobCount = jobs.length;

	const persistedJob = jobs[jobIndex] ?? null;

	if (persistedJob === null) {
		return null;
	}

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
		jobIndex,
	};
};

export class IntuitaPanelProvider {
	private __webviewPanel: WebviewPanel | null = null;

	public constructor(
		private readonly __extensionUri: Uri,
		private readonly __store: Store,
		rootPath: string,
	) {
		let prevViewProps = selectPanelViewProps(__store.getState(), rootPath);

		__store.subscribe(async () => {
			const nextViewProps = selectPanelViewProps(
				__store.getState(),
				rootPath,
			);

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

			this.__webviewPanel.webview.onDidReceiveMessage(
				(message: WebviewResponse) => {
					if (message.kind === 'webview.panel.changeJob') {
						this.__store.dispatch(
							actions.changeJob(message.direction),
						);
					}

					if (message.kind === 'webview.global.reportIssue') {
						const state = this.__store.getState();

						const job =
							state.job.entities[message.faultyJobHash] ?? null;

						if (job === null) {
							throw new Error('Unable to get the job');
						}

						const query = new URLSearchParams({
							title: `[Codemod][${job.codemodName}] Invalid codemod output`,
							body: buildIssueTemplate(job.codemodName),
							template: 'report-faulty-codemod.md',
						}).toString();

						commands.executeCommand(
							'intuita.redirect',
							`https://github.com/intuita-inc/codemod-registry/issues/new?${query}`,
						);
					}

					if (
						message.kind === 'webview.global.showInformationMessage'
					) {
						window.showInformationMessage(message.value);
					}
				},
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
