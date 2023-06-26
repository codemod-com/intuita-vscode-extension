import { WebviewView } from 'vscode';
import { View, WebviewMessage } from './webviewEvents';
import { Store } from '../../data';
import areEqual from 'fast-deep-equal';
import { selectCodemodRunsTree } from '../../selectors/selectCodemodRunsTree';

type ViewProps = Extract<View, { viewId: 'campaignManagerView' }>['viewProps'];

export class CampaignManager {
	private __webviewView: WebviewView | null = null;

	constructor(private readonly __store: Store) {
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
	}

	public getInitialProps(): ViewProps {
		return this.__buildViewProps();
	}

	public setWebview(webviewView: WebviewView): void | Thenable<void> {
		this.__webviewView = webviewView;
	}

	private __postMessage(message: WebviewMessage) {
		this.__webviewView?.webview.postMessage(message);
	}

	private __buildViewProps(): ViewProps {
		return selectCodemodRunsTree(this.__store.getState());
	}
}
