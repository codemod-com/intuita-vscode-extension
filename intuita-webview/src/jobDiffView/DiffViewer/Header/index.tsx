import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType } from '../../../shared/types';

import styles from './style.module.css';

type Props = Readonly<{
	title: string;
	viewType: DiffViewType;
	onViewChange(value: DiffViewType): void;
}>;

const Header = ({ title, viewType, onViewChange }: Props) => {
	const handleTitleClick = () => {
		navigator.clipboard.writeText(title);
	};

	return (
		<div className={styles.root}>
			<div className={styles.title} onClick={handleTitleClick}>
				<span>{title}</span>
				<VSCodeButton
					className={styles.copyButton}
					onClick={handleTitleClick}
					appearance="secondary"
				>
					Copy
				</VSCodeButton>
			</div>
			{viewType === 'side-by-side' ? (
				<VSCodeButton
					title="Inline"
					appearance="icon"
					onClick={() => onViewChange('inline')}
				>
					Inline <UnifiedIcon className={styles.icon} />
				</VSCodeButton>
			) : (
				<VSCodeButton
					title="Side by Side"
					appearance="icon"
					onClick={() => onViewChange('side-by-side')}
				>
					Side by Side <SplitIcon className={styles.icon} />
				</VSCodeButton>
			)}
		</div>
	);
};

export default Header;
