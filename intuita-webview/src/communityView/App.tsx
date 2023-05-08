import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as DocsIcon } from '../assets/docs.svg';
import { ReactComponent as SlackIcon } from '../assets/slack.svg';
import { ReactComponent as YoutubeIcon } from '../assets/youtube.svg';
import { ReactElement, useEffect, useState } from 'react';
import { vscode } from '../shared/utilities/vscode';
import { View, WebviewMessage } from '../shared/types';
import { ExternalLink } from '../../../src/components/webview/webviewEvents';
import intuitaLogo from './../assets/intuita_square128.png';

import styles from './style.module.css';

type MainViews = Extract<View, { viewId: 'communityView' }>;

const getIcon = (icon: string): ReactElement | null => {
	const IntuitaIcon = (
		<img className={styles.icon} src={intuitaLogo} alt="intuita-logo" />
	);

	switch (icon) {
		case 'youtube':
			return <YoutubeIcon className={styles.icon} />;

		case 'featureRequest':
			return IntuitaIcon;

		case 'codemodRequest':
			return IntuitaIcon;

		case 'docs':
			return <DocsIcon className={styles.icon} />;

		case 'slack':
			return (
				<SlackIcon
					className={styles.icon}
					style={{
						width: '30px',
						height: '30px',
						marginTop: '-2px',
						marginLeft: '-6px',
						marginRight: '1px',
					}}
				/>
			);
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

	if (!view || !view.viewProps?.externalLinks) {
		return null;
	}

	return (
		<main className="App">
			<div className={styles.container}>
				{view.viewProps.externalLinks.map(
					({ text, url, icon }: ExternalLink) => {
						const handleButtonClick = (
							event: Event | React.FormEvent<HTMLElement>,
						) => {
							event.stopPropagation();
							vscode.postMessage({
								kind: 'webview.command',
								value: {
									command: 'openLink',
									arguments: [url],
									title: text,
								},
							});
						};
						return (
							<VSCodeButton
								className={styles.button}
								appearance="icon"
								onClick={handleButtonClick}
							>
								{getIcon(icon)}
								<span className={styles.text}>{text}</span>
							</VSCodeButton>
						);
					},
				)}
			</div>
		</main>
	);
}

export default App;