import {
	VSCodeButton,
	VSCodeProgressRing,
} from '@vscode/webview-ui-toolkit/react';
import Popover from '../../shared/Popover';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import { JobHash } from '../../shared/types';
import { CaseHash } from '../../../../src/cases/types';
import { ReactComponent as CheckboxIndeterminate } from '../../assets/checkbox_indeterminate.svg';
import { ReactComponent as CheckboxBlank } from '../../assets/checkbox_blank.svg';
import { ReactComponent as CheckboxChecked } from '../../assets/checkbox_checked.svg';
import { ExplorerNodeHashDigest } from '../../../../src/selectors/selectExplorerTree';

const POPOVER_TEXTS = {
	discard: 'Discard all the proposed changes for the highlighted codemod.',
	apply: 'Save changes to file(s), further tweak things if needed, and commit later.',
	cannotApply: 'At least one job should be selected to apply the changes.',
};

type Props = Readonly<{
	caseHash: CaseHash;
	jobHashes: ReadonlyArray<JobHash>;
	deselectedHashDigests: ReadonlyArray<ExplorerNodeHashDigest>;
	screenWidth: number | null;
}>;

const ActionsHeader = ({
	deselectedHashDigests,
	caseHash,
	jobHashes,
	screenWidth,
}: Props) => {
	const ready = jobHashes.length > 0;
	const hasStagedJobs =
		ready &&
		deselectedHashDigests.length > 0 &&
		deselectedHashDigests.length < jobHashes.length;
	const hasStagedAllJobs = ready && deselectedHashDigests.length === 0;

	const handleToggleAllJobs = () => {
		if (!ready) {
			return;
		}

		vscode.postMessage({
			kind: 'webview.global.resetDeselectedChangeExplorerNodeHashDigests',
			fillWith: hasStagedJobs ? 'all' : 'none',
		});
	};

	const handleDiscardChanges = () => {
		vscode.postMessage({
			kind: 'webview.global.discardChanges',
			caseHash,
		});

		vscode.postMessage({
			kind: 'webview.fileExplorer.disposeView',
			webviewName: 'diffView',
		});
	};

	const handleApplySelected = () => {
		vscode.postMessage({
			kind: 'webview.global.applySelected',
			diffId: caseHash,
		});

		vscode.postMessage({
			kind: 'webview.fileExplorer.disposeView',
			webviewName: 'diffView',
		});
	};

	let discardText = 'Discard All';
	let applyText = 'Apply Selected';

	if (screenWidth !== null && screenWidth < 340) {
		discardText = 'X';
		applyText = '✔️';
	} else if (screenWidth !== null && screenWidth < 420) {
		discardText = 'Discard';
		applyText = 'Apply';
	}

	return (
		<div className={styles.root}>
			{ready ? (
				<h4
					className={styles.selectedFileCount}
				>{`Total files: ${jobHashes.length}`}</h4>
			) : (
				<VSCodeProgressRing className={styles.progressRing} />
			)}
			<Popover
				trigger={
					<VSCodeButton
						appearance="secondary"
						onClick={handleDiscardChanges}
						className={styles.vscodeButton}
						disabled={!ready}
					>
						{discardText}
					</VSCodeButton>
				}
				popoverText={POPOVER_TEXTS.discard}
				contentStyle={{
					backgroundColor: 'var(--vscode-editor-background)',
					padding: '8px',
				}}
			/>
			<Popover
				trigger={
					<VSCodeButton
						appearance="primary"
						onClick={handleApplySelected}
						disabled={!ready || !hasStagedJobs}
						className={styles.vscodeButton}
					>
						{applyText}
					</VSCodeButton>
				}
				popoverText={
					!hasStagedJobs
						? POPOVER_TEXTS.cannotApply
						: POPOVER_TEXTS.apply
				}
				contentStyle={{
					backgroundColor: 'var(--vscode-editor-background)',
					padding: '8px',
				}}
			/>
			<Popover
				trigger={
					<VSCodeButton
						disabled={!ready}
						onClick={handleToggleAllJobs}
						appearance="icon"
					>
						{!hasStagedJobs && (
							<CheckboxBlank className={styles.icon} />
						)}
						{hasStagedJobs &&
							(hasStagedAllJobs ? (
								<CheckboxChecked className={styles.icon} />
							) : (
								<CheckboxIndeterminate
									className={styles.icon}
								/>
							))}
					</VSCodeButton>
				}
				popoverText={
					!hasStagedJobs
						? 'Select all changes'
						: 'Unselect all changes'
				}
				contentStyle={{
					backgroundColor: 'var(--vscode-editor-background)',
					padding: '8px',
				}}
			/>
		</div>
	);
};

export default ActionsHeader;
