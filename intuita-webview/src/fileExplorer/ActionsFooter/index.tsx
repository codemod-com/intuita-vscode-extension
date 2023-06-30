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
const getApplyText = (selectedJobCount: number) =>
	`Apply ${selectedJobCount} files`;

type Props = Readonly<{
	caseHash: CaseHash;
	selectedJobCount: number;
	screenWidth: number | null;
}>;

export const ActionsFooter = ({
	caseHash,
	selectedJobCount,
	screenWidth,
}: Props) => {
	return (
		<div
			className={styles.root}
			style={{
				...(screenWidth !== null &&
					screenWidth < 330 && { marginRight: 'auto' }),
			}}
		>
			<Popover
				children={
					<VSCodeButton
						appearance="secondary"
						onClick={(event) => {
							event.preventDefault();

							discardChanges(caseHash);
						}}
						className={styles.vscodeButton}
					>
						{discardText}
					</VSCodeButton>
				}
				content={POPOVER_TEXTS.discard}
			/>
			<Popover
				children={
					<VSCodeButton
						appearance="primary"
						onClick={(event) => {
							event.preventDefault();

							applySelected(caseHash);
						}}
						className={styles.vscodeButton}
					>
						{getApplyText(selectedJobCount)}
					</VSCodeButton>
				}
				content={
					selectedJobCount === 0
						? POPOVER_TEXTS.cannotApply
						: POPOVER_TEXTS.apply
				}
			/>
		</div>
	);
};
