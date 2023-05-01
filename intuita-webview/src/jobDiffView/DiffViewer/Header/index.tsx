import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType } from '../../../shared/types';

import styles from './style.module.css';
import { vscode } from '../../../shared/utilities/vscode';
import { JobHash } from '../../../../../src/jobs/types';

type Props = Readonly<{
	title: string;
	viewType: DiffViewType;
	stagedJobHashes: Set<JobHash>;
	diffId: string;
	changesAccepted: boolean;
	onViewChange(value: DiffViewType): void;
}>;

const Header = ({
	title,
	viewType,
	diffId,
	stagedJobHashes,
	changesAccepted,
	onViewChange,
}: Props) => {
	const handleTitleClick = () => {
		navigator.clipboard.writeText(title);
	};

	const jobHashes = Array.from(stagedJobHashes);

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

	const hasStagedJobs = stagedJobHashes.size !== 0;
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
						title={
							hasStagedJobs
								? 'Go to commit settings'
								: 'At least one file should be selected'
						}
						appearance="primary"
						onClick={handleCommit}
						disabled={!hasStagedJobs}
					>
						Commit...
					</VSCodeButton>
				) : (
					<VSCodeButton
						title={
							hasStagedJobs
								? 'Apply all selected files'
								: 'At least one file should be selected'
						}
						appearance="primary"
						onClick={handleApplySelected}
						disabled={!hasStagedJobs}
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
