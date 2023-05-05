import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as CaseIcon } from '../assets/arrow-down.svg';
import { ReactElement, useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import { View, WebviewMessage } from '../shared/types';
import { ExternalLink } from '../../../src/components/webview/webviewEvents';

type MainViews = Extract<View, { viewId: 'communityView' }>;

const getIcon = (icon: string): ReactElement | null => {
	switch (icon) {
		case 'youtube':
			return <CaseIcon />;

		case 'featureRequest':
			return <CaseIcon />;

		case 'codemodRequest':
			return <CaseIcon />;

		case 'docs':
			return <CaseIcon />;

		case 'slack':
			return <CaseIcon />;
	}
	return null;
};

function App() {
	const [view, setView] = useState<MainViews | null>(null);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.global.setView') {
				if (message.value.viewId === 'communityView') {
					setView(message.value);
				}
			}
		};

		window.addEventListener('message', handler);

		vscode.postMessage({ kind: 'webview.global.afterWebviewMounted' });

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	if (!view || !view.externalLinks) {
		return null;
	}

	return (
		<main className="App">
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
				}}
			>
				{view.externalLinks.map(({ text, url, icon }: ExternalLink) => {
					return (
						<VSCodeButton
							appearance="secondary"
							onClick={() => {
								vscode.postMessage({
									kind: 'webview.command',
									value: {
										command: 'openLink',
										arguments: [url],
										title: text,
									},
								});
							}}
							style={{
								display: 'flex',
								alignItems: 'center',
							}}
						>
							{getIcon(icon)}
							{text}
						</VSCodeButton>
					);
				})}
			</div>
		</main>
	);
}

export default App;
