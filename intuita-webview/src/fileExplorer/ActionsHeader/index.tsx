import { VSCodeButton, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import Popover from '../../shared/Popover';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import { JobHash } from '../../shared/types';
import { CaseHash } from '../../../../src/cases/types';
import { FileTreeNode } from '../../../../src/components/webview/webviewEvents';

const POPOVER_TEXTS = {
	discard: 'Discard the codemod in progress without saving changes.',
	apply: 'Save changes to file, further tweak things if needed, and commit later.',
	commit: 'Commit or create pull requests for selected changes.',
	cannotApply: 'At least one job should be staged to commit the changes.',
};

type Props = {
	stagedJobs: JobHash[];
	caseHash: CaseHash;
	fileNodes: FileTreeNode[];
};

const ActionsHeader = ({ stagedJobs, caseHash, fileNodes }: Props) => {
	const hasStagedJobs = stagedJobs.length > 0;

	const handleToggleAllJobs = () => {
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
			<h4
				className={styles.selectedFileCount}
			>{`Selected files: ${stagedJobs.length} of ${fileNodes.length}`}</h4>
			<Popover
				trigger={
					<VSCodeButton
						appearance="secondary"
						onClick={handleDiscardChanges}
						className={styles.vscodeButton}
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
						disabled={!hasStagedJobs}
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
					<VSCodeCheckbox
						checked={hasStagedJobs}
						onClick={handleToggleAllJobs}
					/>
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
