import { VSCodeLink } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as SlackIcon } from '../assets/slack.svg';
import { ReactComponent as YoutubeIcon } from '../assets/youtube.svg';
import { ReactElement } from 'react';
import { ExternalLink } from '../../../src/components/webview/webviewEvents';
import intuitaLogo from './../assets/intuita_square128.png';

import styles from './style.module.css';

const getIcon = (id: string): ReactElement | null => {
	const IntuitaIcon = (
		<img className={styles.icon} src={intuitaLogo} alt="intuita-logo" />
	);

	switch (id) {
		case 'youtube':
			return <YoutubeIcon className={styles.icon} />;

		case 'featureRequest':
			return IntuitaIcon;

		case 'codemodRequest':
			return IntuitaIcon;

		case 'docs':
			return IntuitaIcon;

		case 'slack':
			return (
				<SlackIcon
					className={styles.icon}
					style={{
						width: '15px',
						height: '15px',
						marginLeft: '-2px',
						marginRight: '2px',
					}}
				/>
			);
	}
	return null;
};

type Props = { screenWidth: number | null };

function App({ screenWidth: _screenWidth }: Props) {
	return (
		<main className="App">
			<div className={styles.container}>
				{window.INITIAL_STATE.communityProps.externalLinks.map(
					({ text, url, id }: ExternalLink) => {
						return (
							<VSCodeLink className={styles.link} href={url}>
								<span slot="start">{getIcon(id)}</span>
								<span
									style={{
										...(id !== 'slack' && {
											marginLeft: '5px',
										}),
									}}
								>
									{text}
								</span>
							</VSCodeLink>
						);
					},
				)}
			</div>
		</main>
	);
}

export default App;
