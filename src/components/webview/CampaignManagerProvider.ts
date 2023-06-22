import { WebviewView, commands } from 'vscode';
import { Message, MessageBus, MessageKind } from '../messageBus';
import { View, WebviewMessage } from './webviewEvents';
import { actions } from '../../data/slice';
import { Store } from '../../data';
import areEqual from 'fast-deep-equal';
import { selectCodemodRunsTree } from '../../selectors/selectCodemodRunsTree';

type ViewProps = Extract<View, { viewId: 'campaignManagerView' }>['viewProps'];

export class CampaignManager {
	private __webviewView: WebviewView | null = null;

	constructor(
		private readonly __messageBus: MessageBus,
		private readonly __store: Store,
	) {}

	setWebview(webviewView: WebviewView): void | Thenable<void> {
		this.__webviewView = webviewView;
		this.__attachExtensionEventListeners();
		this.__attachWebviewEventListeners();
	}

	public setView() {
		const viewProps = this.__buildViewProps();

		this.__postMessage({
			kind: 'webview.codemodRuns.setView',
			value: {
				viewId: 'campaignManagerView',
				viewProps,
			},
		});
	}

	public showView() {
		this.__webviewView?.show(true);
	}

	private __postMessage(message: WebviewMessage) {
		this.__webviewView?.webview.postMessage(message);
	}

	private __addHook<T extends MessageKind>(
		kind: T,
		handler: (message: Message & { kind: T }) => void,
	) {
		this.__messageBus.subscribe<T>(kind, handler);
	}
	private __attachExtensionEventListeners() {
		let prevProps = this.__buildViewProps();

		this.__store.subscribe(() => {
			const nextProps = this.__buildViewProps();

			if (areEqual(prevProps, nextProps)) {
				return;
			}

			prevProps = nextProps;

			this.__postMessage({
				kind: 'webview.codemodRuns.setView',
				value: {
					viewId: 'campaignManagerView',
					viewProps: nextProps,
				},
			});
		});

		this.__addHook(MessageKind.upsertCases, (message) => {
			const hash = message.casesWithJobHashes[0]?.hash ?? null;

			if (hash !== null) {
				commands.executeCommand('intuita.openCaseDiff', hash);
			}
		});

		this.__addHook(MessageKind.codemodSetExecuted, (message) => {
			commands.executeCommand('intuita.openCaseDiff', message.case.hash);
		});
	}

	private __attachWebviewEventListeners() {
		if (this.__webviewView === null) {
			return;
		}

		this.__webviewView.webview.onDidReceiveMessage((message) => {
			if (message.kind === 'webview.command') {
				commands.executeCommand(
					message.value.command,
					...(message.value.arguments ?? []),
				);
			}

			if (
				message.kind === 'webview.campaignManager.setSelectedCaseHash'
			) {
				this.__store.dispatch(
					actions.setSelectedCaseHash(message.caseHash),
				);
			}
		});
	}

	public getInitialProps(): ViewProps {
		return this.__buildViewProps();
	}

	private __buildViewProps(): ViewProps {
		return selectCodemodRunsTree(this.__store.getState());
	}
}
