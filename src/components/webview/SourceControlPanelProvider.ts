import { Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import type { RootState, Store } from '../../data';
import { WebviewResolver } from './WebviewResolver';
import areEqual from 'fast-deep-equal';
import { WebviewMessage, WebviewResponse } from './webviewEvents';
import { actions } from '../../data/slice';
import { MainViewProvider } from './MainProvider';
import { MessageBus, MessageKind } from '../messageBus';
import { SourceControlViewProps } from './sourceControlViewProps';
import { createBeforeAfterSnippets } from './IntuitaPanelProvider';
import { removeLineBreaksAtStartAndEnd } from '../../utilities';

const buildIssueTemplate = (
	codemodName: string,
	before: string | null,
	after: string | null,
	expected: string | null,
): string => {
	return `
---
:warning::warning: Please do not include any proprietary code in the issue. :warning::warning:

---
Codemod: ${codemodName}

**1. Code before transformation (Input for codemod)**

\`\`\`jsx
${before ?? '// paste code here'}
\`\`\`

**2. Expected code after transformation (Desired output of codemod)**

\`\`\`jsx
${expected ?? '// paste code here'}
\`\`\`

**3. Faulty code obtained after running the current version of the codemod (Actual output of codemod)**

\`\`\`jsx
${after ?? '// paste code here'}
\`\`\`

---	
**Additional context**`;
};

const selectSourceControlViewProps = (
	mainWebviewViewProvider: MainViewProvider,
	state: RootState,
): SourceControlViewProps | null => {
	if (!state.jobDiffView.visible) {
		return null;
	}

	if (!mainWebviewViewProvider.isVisible()) {
		return null;
	}

	const { kind, oldFileContent, newFileContent, jobHash } =
		state.sourceControl;

	if (
		kind !== 'CREATE_ISSUE' ||
		oldFileContent === null ||
		newFileContent === null ||
		jobHash === null
	) {
		return null;
	}

	const job = state.job.entities[jobHash] ?? null;

	if (job === null) {
		throw new Error('Unable to get the job');
	}

	const { beforeSnippet, afterSnippet } = createBeforeAfterSnippets(
		oldFileContent,
		newFileContent,
	);

	const body = removeLineBreaksAtStartAndEnd(
		buildIssueTemplate(job.codemodName, beforeSnippet, afterSnippet, null),
	);

	const title = `[Codemod:${job.codemodName}] Invalid codemod output`;

	return {
		kind,
		title,
		body,
	};
};

const TYPE = 'sourceControlPanel';
const WEBVIEW_NAME = 'sourceControl';

export class SourceControlPanelProvider {
	private __webviewPanel: WebviewPanel | null = null;

	public constructor(
		private readonly __extensionUri: Uri,
		private readonly __store: Store,
		private readonly __mainWebviewViewProvider: MainViewProvider,
		messageBus: MessageBus,
	) {
		let prevViewProps = selectSourceControlViewProps(
			__mainWebviewViewProvider,
			__store.getState(),
		);

		const listener = async () => {
			const nextViewProps = selectSourceControlViewProps(
				__mainWebviewViewProvider,
				__store.getState(),
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
		};

		__store.subscribe(listener);

		messageBus.subscribe(
			MessageKind.mainWebviewViewVisibilityChange,
			listener,
		);
	}

	private async __upsertPanel(
		sourceControlViewProps: SourceControlViewProps,
		preserveFocus: boolean,
	) {
		if (this.__webviewPanel === null) {
			const webviewResolver = new WebviewResolver(this.__extensionUri);
			this.__webviewPanel = window.createWebviewPanel(
				TYPE,
				sourceControlViewProps.title,
				{
					viewColumn: ViewColumn.One,
					preserveFocus,
				},
				webviewResolver.getWebviewOptions(),
			);

			webviewResolver.resolveWebview(
				this.__webviewPanel.webview,
				WEBVIEW_NAME,
				JSON.stringify(sourceControlViewProps),
				'sourceControlViewProps',
			);

			this.__webviewPanel.webview.onDidReceiveMessage(
				async (message: WebviewResponse) => {
					if (
						message.kind === 'webview.sourceControl.webviewMounted'
					) {
						const nextViewProps = selectSourceControlViewProps(
							this.__mainWebviewViewProvider,
							this.__store.getState(),
						);

						if (
							nextViewProps === null ||
							this.__webviewPanel === null
						) {
							return;
						}

						this.__webviewPanel.webview.postMessage({
							kind: 'webview.setSourceControlViewProps',
							sourceControlViewProps: nextViewProps,
						} satisfies WebviewMessage);

						this.__webviewPanel.reveal(undefined, preserveFocus);
					}
				},
			);

			this.__webviewPanel.onDidDispose(() => {
				this.__webviewPanel = null;
				this.__store.dispatch(
					actions.setSourceControlViewVisible(false),
				);
			});

			return;
		}

		this.__webviewPanel.title = sourceControlViewProps.title;
		await this.__webviewPanel.webview.postMessage({
			kind: 'webview.setSourceControlViewProps',
			sourceControlViewProps,
		} satisfies WebviewMessage);
		this.__webviewPanel.reveal(undefined, preserveFocus);
	}

	private __disposePanel() {
		this.__webviewPanel?.dispose();

		this.__webviewPanel = null;
	}
}
