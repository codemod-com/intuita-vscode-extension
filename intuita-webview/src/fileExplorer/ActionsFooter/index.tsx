import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import Popover from '../../shared/Popover';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import { CaseHash } from '../../../../src/cases/types';

const POPOVER_TEXTS = {
	discard: 'Discard all the proposed changes for the highlighted codemod.',
	apply: 'Save changes to file(s), further tweak things if needed, and commit later.',
	cannotApply: 'At least one job should be selected to apply the changes.',
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
		caseHashDigest,
	});
};

export const ActionsFooter = (
	props: Readonly<{
		searchPhrase: string;
		caseHash: CaseHash;
		selectedJobCount: number;
		screenWidth: number | null;
	}>,
) => {
	console.log(props.screenWidth)
	let discardText = 'Discard All';
	let applyText = `Apply ${props.selectedJobCount} files`;

	if (props.screenWidth !== null && props.screenWidth < 175) {
		discardText = 'X';
		applyText = '✔️';
	}

	return (
		<div
			className={styles.root}
			style={{
				...(props.screenWidth !== null &&
					props.screenWidth < 330 && { marginRight: 'auto' }),
			}}
		>
			<Popover
				trigger={
					<VSCodeButton
						appearance="secondary"
						onClick={(event) => {
							event.preventDefault();

							discardChanges(props.caseHash);
						}}
						className={styles.vscodeButton}
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
						className={styles.vscodeButton}
					>
						{`${applyText} ${
							applyText === 'Apply'
								? `${props.selectedJobCount} files`
								: ''
						}`}
					</VSCodeButton>
				}
				popoverText={
					props.selectedJobCount === 0
						? POPOVER_TEXTS.cannotApply
						: POPOVER_TEXTS.apply
				}
				contentStyle={{
					backgroundColor: 'var(--vscode-editor-background)',
					padding: '8px',
				}}
			/>
		</div>
	);
};
