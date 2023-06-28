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

const discardText = 'Discard All';
const applyText = `Apply files`;

export const ActionsFooter = (
	props: Readonly<{
		searchPhrase: string;
		caseHash: CaseHash;
		selectedJobCount: number;
		screenWidth: number | null;
	}>,
) => {
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
						{applyText}
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
