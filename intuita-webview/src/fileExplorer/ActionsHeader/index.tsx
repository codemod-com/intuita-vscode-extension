import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import Popover from '../../shared/Popover';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import { CaseHash } from '../../../../src/cases/types';
import { ReactComponent as CheckboxIndeterminate } from '../../assets/checkbox_indeterminate.svg';
import { ReactComponent as CheckboxBlank } from '../../assets/checkbox_blank.svg';
import { ReactComponent as CheckboxChecked } from '../../assets/checkbox_checked.svg';

const POPOVER_TEXTS = {
	discard: 'Discard all the proposed changes for the highlighted codemod.',
	apply: 'Save changes to file(s), further tweak things if needed, and commit later.',
	cannotApply: 'At least one job should be selected to apply the changes.',
};

const flipSelectedExplorerNodes = (caseHashDigest: CaseHash) => {
	// TODO RESTORE
	// vscode.postMessage({
	// 	kind: 'webview.global.flipSelectedExplorerNodes',
	// 	caseHashDigest,
	// });
};

const discardChanges = (caseHashDigest: CaseHash) => {
	vscode.postMessage({
		kind: 'webview.global.discardChanges',
		caseHash: caseHashDigest,
	});
};

const applySelected = (caseHashDigest: CaseHash) => {
	vscode.postMessage({
		kind: 'webview.global.applySelected',
		jobHashes: [], // TODO remove
		diffId: caseHashDigest, // TODO to caseHashDigest
	});
};

export const ActionsHeader = (
	props: Readonly<{
		searchPhrase: string;
		caseHash: CaseHash;
		selectedJobCount: number;
		jobCount: number;
		screenWidth: number | null;
	}>,
) => {
	const status =
		props.selectedJobCount === props.jobCount
			? 'ALL'
			: props.selectedJobCount > 0
			? 'SOME'
			: 'NONE';

	let discardText = 'Discard All';
	let applyText = 'Apply Selected';

	if (props.screenWidth !== null && props.screenWidth < 340) {
		discardText = 'X';
		applyText = '✔️';
	} else if (props.screenWidth !== null && props.screenWidth < 420) {
		discardText = 'Discard';
		applyText = 'Apply';
	}

	return (
		<div className={styles.root}>
			<h4
				className={styles.selectedFileCount}
			>{`Selected files: ${props.selectedJobCount} of ${props.jobCount}`}</h4>

			<Popover
				trigger={
					<VSCodeButton
						appearance="secondary"
						onClick={(event) => {
							event.preventDefault();

							discardChanges(props.caseHash);
						}}
						className={styles.vscodeButton}
						disabled={props.searchPhrase.length !== 0}
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
						onClick={(event) => {
							event.preventDefault();

							applySelected(props.caseHash);
						}}
						disabled={
							props.searchPhrase.length !== 0 || status === 'NONE'
						}
						className={styles.vscodeButton}
					>
						{applyText}
					</VSCodeButton>
				}
				popoverText={
					status === 'NONE'
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
						disabled={props.searchPhrase.length !== 0}
						onClick={(event) => {
							event.stopPropagation();

							flipSelectedExplorerNodes(props.caseHash);
						}}
						appearance="icon"
					>
						{status === 'NONE' && (
							<CheckboxBlank className={styles.icon} />
						)}
						{status === 'SOME' && (
							<CheckboxIndeterminate className={styles.icon} />
						)}
						{status === 'ALL' && (
							<CheckboxChecked className={styles.icon} />
						)}
					</VSCodeButton>
				}
				popoverText={
					status === 'NONE'
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
