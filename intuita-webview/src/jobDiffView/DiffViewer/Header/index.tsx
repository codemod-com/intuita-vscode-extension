import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType, JobDiffViewProps } from '../../../shared/types';

import styles from './style.module.css';
import { vscode } from '../../../shared/utilities/vscode';

type Props = Readonly<{
	title: string;
	viewType: DiffViewType;
	jobs: JobDiffViewProps[];
	diffId: string;
	changesAccepted: boolean;
	onViewChange(value: DiffViewType): void;
}>;

const Header = ({
	title,
	viewType,
	jobs,
	diffId,
	changesAccepted,
	onViewChange,
}: Props) => {
	const handleTitleClick = () => {
		navigator.clipboard.writeText(title);
	};

	const jobHashes = jobs.map(({ jobHash }) => jobHash);

	const handleCommit = () => {
		vscode.postMessage({
			kind: 'webview.global.navigateToCommitView',
			jobHashes,
			diffId,
		});
	};

	const handleApplySelected = () => {
		vscode.postMessage({
			kind: 'webview.global.applySelected',
			jobHashes,
			diffId,
		});
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
			<div className={styles.actionsContainer}>
				{changesAccepted ? (
					<VSCodeButton
						appearance="primary"
						title="Show commit options"
						onClick={handleCommit}
					>
						Commit...
					</VSCodeButton>
				) : (
					<VSCodeButton
						appearance="primary"
						onClick={handleApplySelected}
					>
						Apply selected
					</VSCodeButton>
				)}
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
