import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType, JobDiffViewProps } from '../../../shared/types';

import styles from './style.module.css';
import { vscode } from '../../../shared/utilities/vscode';
import { CaseHash } from '../../../../../src/cases/types';

type Props = Readonly<{
	title: string;
	viewType: DiffViewType;
	jobs: JobDiffViewProps[];
	diffId: string;
	onViewChange(value: DiffViewType): void;
}>;

const Header = ({ title, viewType, diffId, jobs, onViewChange }: Props) => {
	const handleTitleClick = () => {
		navigator.clipboard.writeText(title);
	};

	const stagedJobHashes = jobs
		.filter((job) => job.staged)
		.map(({ jobHash }) => jobHash);

	const handleDiscardChanges = () => {
		vscode.postMessage({
			kind: 'webview.global.discardChanges',
			caseHash: diffId as CaseHash,
		});

		vscode.postMessage({
			kind: 'webview.global.closeView',
		});
	};

	const handleApplySelected = () => {
		vscode.postMessage({
			kind: 'webview.global.applySelected',
			jobHashes: stagedJobHashes,
			diffId,
		});

		vscode.postMessage({
			kind: 'webview.global.closeView',
		});
	};

	const hasStagedJobs = stagedJobHashes.length !== 0;
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
				<VSCodeButton
					appearance="secondary"
					onClick={handleDiscardChanges}
				>
					Discard All
				</VSCodeButton>
				<VSCodeButton
					title={
						hasStagedJobs
							? 'Save changes to file, further tweak things if needed, and commit later.'
							: 'At least one file should be selected.'
					}
					appearance="primary"
					onClick={handleApplySelected}
					disabled={!hasStagedJobs}
				>
					Apply Selected
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
