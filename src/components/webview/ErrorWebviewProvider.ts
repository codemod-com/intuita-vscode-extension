import {
	ExtensionContext,
	WebviewView,
	WebviewViewProvider,
	commands,
} from 'vscode';
import { MessageBus, MessageKind } from '../messageBus';
import { View, WebviewMessage } from './webviewEvents';
import { WebviewResolver } from './WebviewResolver';
import { Store } from '../../data';
import { actions } from '../../data/slice';
import { CaseHash } from '../../cases/types';
import areEqual from 'fast-deep-equal';

type ViewProps = Extract<View, { viewId: 'errors' }>['viewProps'];

export class ErrorWebviewProvider implements WebviewViewProvider {
	private readonly __webviewResolver: WebviewResolver;
	private __webviewView: WebviewView | null = null;

	public constructor(
		context: ExtensionContext,
		messageBus: MessageBus,
		private readonly __store: Store,
	) {
		this.__webviewResolver = new WebviewResolver(context.extensionUri);

		messageBus.subscribe(
			MessageKind.codemodSetExecuted,
			async ({ case: kase, executionErrors }) => {
				this.__store.dispatch(
					actions.setExecutionErrors({
						caseHash: kase.hash,
						errors: executionErrors,
					}),
				);

				if (executionErrors.length !== 0) {
					this.showView();

					await commands.executeCommand('intuitaErrorViewId.focus');
				}
			},
		);

		messageBus.subscribe(MessageKind.clearState, () => {
			this.__store.dispatch(actions.setSelectedCaseHash(null));
		});

		let prevProps = this.__buildViewProps();

		this.__store.subscribe(() => {
			const nextProps = this.__buildViewProps();

			if (areEqual(prevProps, nextProps)) {
				return;
			}

			prevProps = nextProps;

			console.log(nextProps);

			this.__postMessage({
				kind: 'webview.global.setView',
				value: {
					viewId: 'errors',
					viewProps: nextProps,
				},
			});
		});
	}

	public resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
		this.__webviewView = webviewView;

		const resolve = () => {
			const errorsViewProps = this.__buildViewProps();

			this.__webviewResolver.resolveWebview(
				webviewView.webview,
				'errors',
				JSON.stringify({
					errorsViewProps,
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
		const state = this.__store.getState();

		const caseHash = state.codemodRunsView
			.selectedCaseHash as CaseHash | null;

		const executionErrors =
			caseHash !== null ? state.executionErrors[caseHash] ?? [] : [];

		return {
			caseHash,
			executionErrors,
		};
	}

	private __postMessage(message: WebviewMessage) {
		this.__webviewView?.webview.postMessage(message);
	}
}
