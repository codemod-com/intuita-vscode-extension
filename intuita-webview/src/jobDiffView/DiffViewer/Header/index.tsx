import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ReactComponent as UnifiedIcon } from '../../../assets/Unified.svg';
import { ReactComponent as SplitIcon } from '../../../assets/Split.svg';
import { DiffViewType, JobDiffViewProps } from '../../../shared/types';

import styles from './style.module.css';
import { vscode } from '../../../shared/utilities/vscode';
import { CaseHash } from '../../../../../src/cases/types';
import Popover from '../../../shared/Popover';
import { JobHash } from '../../../../../src/jobs/types';
import HooksCTA from './HooksCTA';

const POPOVER_TEXTS = {
	discard: 'Discard the codemod in progress without saving changes.',
	apply: 'Save changes to file, further tweak things if needed, and commit later.',
	commit: 'Commit or create pull requests for selected changes.',
	cannotApply: 'At least one job should be staged to commit the changes.',
};

type Props = Readonly<{
	showHooksCTA: boolean;
	viewType: DiffViewType;
	jobs: JobDiffViewProps[];
	diffId: string;
	onViewChange(value: DiffViewType): void;
	stagedJobsHashes: JobHash[];
}>;

const Header = ({
	viewType,
	diffId,
	onViewChange,
	stagedJobsHashes,
	showHooksCTA,
}: Props) => {
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
			jobHashes: stagedJobsHashes,
			diffId,
		});

		vscode.postMessage({
			kind: 'webview.global.closeView',
		});
	};

	const hasStagedJobs = stagedJobsHashes.length !== 0;

	return (
		<div className={styles.root}>
			<div className={styles.actionsContainer}>
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
			</div>
			<div className={styles.buttonGroup}>
				{showHooksCTA ? (
					<HooksCTA style={{ marginRight: '5px' }} />
				) : null}
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
		</div>
	);
};

export default Header;
