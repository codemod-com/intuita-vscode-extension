import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType, JobDiffViewProps } from '../../../shared/types';

import styles from './style.module.css';
import { vscode } from '../../../shared/utilities/vscode';
import { CaseHash } from '../../../../../src/cases/types';
import Popover from '../../../shared/Popover';

const POPOVER_TEXTS = {
	discard: 'Discard the codemod in progress without saving changes.',
	apply: 'Save changes to file, further tweak things if needed, and commit later.',
	commit: 'Commit or create pull requests for selected changes.',
	copy: 'Copy the title of this codemod to the clipboard.',
};

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
				<Popover
					trigger={
						<VSCodeButton
							className={styles.copyButton}
							onClick={handleTitleClick}
							appearance="secondary"
						>
							Copy
						</VSCodeButton>
					}
					popoverText={POPOVER_TEXTS.copy}
				/>
			</div>
			<div className={styles.actionsContainer}>
				<Popover
					trigger={
						<VSCodeButton
							appearance="secondary"
							onClick={handleDiscardChanges}
						>
							Discard All
						</VSCodeButton>
					}
					popoverText={POPOVER_TEXTS.discard}
				/>
				<Popover
					trigger={
						<VSCodeButton
							appearance="primary"
							onClick={handleApplySelected}
							disabled={!hasStagedJobs}
						>
							Apply Selected
						</VSCodeButton>
					}
					popoverText={POPOVER_TEXTS.apply}
				/>
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
