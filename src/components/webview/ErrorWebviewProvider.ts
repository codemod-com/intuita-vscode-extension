import { ExtensionContext, WebviewView, WebviewViewProvider } from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import { View, WebviewMessage } from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';
import { Store } from '../../data';
import { actions } from '../../data/slice';
import areEqual from 'fast-deep-equal';
import { MainViewProvider } from './MainProvider';
import { TabKind } from '../../persistedState/codecs';

type ViewProps = Extract<View, { viewId: 'errors' }>['viewProps'];

export class ErrorWebviewProvider implements WebviewViewProvider {
	private readonly __webviewResolver: WebviewResolver;
	private __webviewView: WebviewView | null = null;

	public constructor(
		context: ExtensionContext,
		messageBus: MessageBus,
		private readonly __store: Store,
		private readonly __mainWebviewViewProvider: MainViewProvider,
	) {
		this.__webviewResolver = new WebviewResolver(context.extensionUri);

		let prevProps = this.__buildViewProps();

		const handler = async () => {
			const nextProps = this.__buildViewProps();

			if (areEqual(prevProps, nextProps)) {
				return;
			}

			prevProps = nextProps;

			this.__postMessage({
				kind: 'webview.global.setView',
				value: {
					viewId: 'errors',
					viewProps: nextProps,
				},
			});

			if (
				nextProps.kind === 'CASE_SELECTED' &&
				nextProps.executionErrors.length !== 0
			) {
				this.showView();
			}
		};

		messageBus.subscribe(
			MessageKind.mainWebviewViewVisibilityChange,
			handler,
		);

		messageBus.subscribe(
			MessageKind.codemodSetExecuted,
			async ({ case: kase, executionErrors }) => {
				this.__store.dispatch(
					actions.setExecutionErrors({
						caseHash: kase.hash,
						errors: executionErrors,
					}),
				);
			},
		);

		this.__store.subscribe(handler);
	}

	public resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		this.__webviewView = webviewView;

		const resolve = () => {
			const errorProps = this.__buildViewProps();

			this.__webviewResolver.resolveWebview(
				webviewView.webview,
				'errors',
				JSON.stringify({
					errorProps,
				}),
			);
		};

		resolve();

		this.__webviewView.onDidChangeVisibility(() => {
			if (this.__webviewView?.visible) {
				resolve();
			}
		});
	}

	public showView() {
		this.__webviewView?.show(true);
	}

	private __buildViewProps(): ViewProps {
		if (!this.__mainWebviewViewProvider.isVisible()) {
			return {
				kind: 'MAIN_WEBVIEW_VIEW_NOT_VISIBLE',
			};
		}

		const state = this.__store.getState();

		if (state.activeTabId !== TabKind.codemodRuns) {
			return {
				kind: 'CODEMOD_RUNS_TAB_NOT_ACTIVE',
			};
		}

		const caseHash = state.codemodRunsView.selectedCaseHash;

		if (caseHash === null) {
			return {
				kind: 'CASE_NOT_SELECTED',
			};
		}

		return {
			kind: 'CASE_SELECTED',
			caseHash,
			executionErrors: state.executionErrors[caseHash] ?? [],
		};
	}

	private __postMessage(message: WebviewMessage) {
		this.__webviewView?.webview.postMessage(message);
	}
}
