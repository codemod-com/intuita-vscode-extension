import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { ReactComponent as CopyIcon } from '../../../assets/copy.svg';
import { DiffViewType, JobDiffViewProps } from '../../../shared/types';

import styles from './style.module.css';
import { vscode } from '../../../shared/utilities/vscode';
import { CaseHash } from '../../../../../src/cases/types';
import Popover from '../../../shared/Popover';
import { JobHash } from '../../../../../src/jobs/types';

const POPOVER_TEXTS = {
	discard: 'Discard the codemod in progress without saving changes.',
	apply: 'Save changes to file, further tweak things if needed, and commit later.',
	commit: 'Commit or create pull requests for selected changes.',
	cannotApply: 'At least one job should be staged to commit the changes.',
};

type Props = Readonly<{
	title: string;
	viewType: DiffViewType;
	jobs: JobDiffViewProps[];
	diffId: string;
	onViewChange(value: DiffViewType): void;
	stagedJobs: JobHash[];
}>;

type CheckboxState = 'allStaged' | 'someStaged' | 'noneStaged';

const getCheckboxProps = (checkboxState: CheckboxState) => {
	switch (checkboxState) {
		case 'allStaged': {
			return {
				title: 'Unselect All',
				icon: 'diff-added',
			};
		}

		case 'someStaged': {
			return {
				title: 'Unselect All',
				icon: 'diff-removed',
			};
		}

		case 'noneStaged': {
			return {
				title: 'Select All',
				icon: 'debug-stop',
			};
		}
	}
};

const Header = ({
	title,
	viewType,
	diffId,
	jobs,
	onViewChange,
	stagedJobs,
}: Props) => {
	const handleTitleClick = () => {
		navigator.clipboard.writeText(title);
	};

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
			jobHashes: stagedJobs,
			diffId,
		});

		vscode.postMessage({
			kind: 'webview.global.closeView',
		});
	};

	const hasStagedJobs = stagedJobs.length !== 0;
	const allJobsStaged = stagedJobs.length === jobs.length;

	const checkboxState: CheckboxState = allJobsStaged
		? 'allStaged'
		: hasStagedJobs
		? 'someStaged'
		: 'noneStaged';
	const props = getCheckboxProps(checkboxState);

	const setStagedJobs = (jobHashes: JobHash[]): void => {
		vscode.postMessage({
			kind: 'webview.global.stageJobs',
			jobHashes,
		});
	};

	return (
		<div className={styles.root}>
			<div className={styles.title} onClick={handleTitleClick}>
				<Popover
					trigger={
						<VSCodeButton
							onClick={(e) => {
								e.stopPropagation();
								const jobsToBeStaged = hasStagedJobs
									? []
									: jobs.map(({ jobHash }) => jobHash);
								setStagedJobs(jobsToBeStaged);
							}}
							appearance="icon"
							className={styles.checkbox}
						>
							<i className={`codicon codicon-${props?.icon}`} />
						</VSCodeButton>
					}
					popoverText={props?.title}
				/>
				<span>{title}</span>
				<VSCodeButton
					onClick={handleTitleClick}
					appearance="icon"
					className={styles.iconContainer}
				>
					<CopyIcon
						className={styles.icon}
						style={{
							width: '21px',
							height: '21px',
						}}
					/>
				</VSCodeButton>
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
					popoverText={
						!hasStagedJobs
							? POPOVER_TEXTS.cannotApply
							: POPOVER_TEXTS.apply
					}
				/>
			</div>
			{viewType === 'side-by-side' ? (
				<VSCodeButton
					title="Inline"
					appearance="icon"
					onClick={() => onViewChange('inline')}
					className={styles.iconContainer}
				>
					Inline <UnifiedIcon className={styles.icon} />
				</VSCodeButton>
			) : (
				<VSCodeButton
					title="Side by Side"
					appearance="icon"
					onClick={() => onViewChange('side-by-side')}
					className={styles.iconContainer}
				>
					Side by Side <SplitIcon className={styles.icon} />
				</VSCodeButton>
			)}
		</div>
	);
};

export default Header;
