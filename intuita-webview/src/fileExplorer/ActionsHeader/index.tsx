import {
	VSCodeButton,
	VSCodeProgressRing,
} from '@vscode/webview-ui-toolkit/react';
import Popover from '../../shared/Popover';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import { JobHash } from '../../shared/types';
import { CaseHash } from '../../../../src/cases/types';
import { FileTreeNode } from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as CheckboxIndeterminate } from '../../assets/checkbox_indeterminate.svg';
import { ReactComponent as CheckboxBlank } from '../../assets/checkbox_blank.svg';
import { ReactComponent as CheckboxChecked } from '../../assets/checkbox_checked.svg';

const POPOVER_TEXTS = {
	discard: 'Discard the codemod in progress without saving changes.',
	apply: 'Save changes to file, further tweak things if needed, and commit later.',
	cannotApply: 'At least one job should be selected to apply the changes.',
};

type Props = {
	stagedJobs: JobHash[];
	caseHash: CaseHash;
	fileNodes: FileTreeNode[] | null;
};

const ActionsHeader = ({ stagedJobs, caseHash, fileNodes }: Props) => {
	const allFileNodesReady = fileNodes !== null;
	const hasStagedJobs = stagedJobs.length > 0;
	const hasStagedAllJobs =
		allFileNodesReady && stagedJobs.length === fileNodes.length;

	const handleToggleAllJobs = () => {
		if (!allFileNodesReady) {
			return;
		}
		const jobHashes: JobHash[] = hasStagedJobs
			? []
			: fileNodes.map((node) => node.jobHash) ?? [];

		vscode.postMessage({
			kind: 'webview.global.stageJobs',
			jobHashes,
		});
	};

	const handleDiscardChanges = () => {
		if (!caseHash) {
			return;
		}

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
		if (!caseHash) {
			return;
		}

		vscode.postMessage({
			kind: 'webview.global.applySelected',
			jobHashes: stagedJobs,
			diffId: caseHash,
		});

		vscode.postMessage({
			kind: 'webview.fileExplorer.disposeView',
			webviewName: 'diffView',
		});
	};

	return (
		<div className={styles.root}>
			{allFileNodesReady ? (
				<h4
					className={styles.selectedFileCount}
				>{`Selected files: ${stagedJobs.length} of ${fileNodes.length}`}</h4>
			) : (
				<VSCodeProgressRing className={styles.progressRing} />
			)}
			<Popover
				trigger={
					<VSCodeButton
						appearance="secondary"
						onClick={handleDiscardChanges}
						className={styles.vscodeButton}
						disabled={!allFileNodesReady}
					>
						Discard All
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
						disabled={!allFileNodesReady || !hasStagedJobs}
						className={styles.vscodeButton}
					>
						Apply Selected
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
						disabled={!allFileNodesReady}
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
