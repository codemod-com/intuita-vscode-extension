import { useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import type {
	View,
	WebviewMessage,
} from '../../../src/components/webview/webviewEvents';
import TreeView from './TreeView';

type MainViews = Extract<View, { viewId: 'codemodList' }>;

function App() {
	const [view, setView] = useState<MainViews | null>(null);

	useEffect(() => {
		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });
	}, []);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;
			if (
				message.kind === 'webview.global.setView' &&
				message.value.viewId === 'codemodList'
			) {
				setView(message.value);
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (!view) {
		return null;
	}

	return (
		<main className="App">
			<TreeView node={view.viewProps.data} />
		</main>
	);
}

export default App;
