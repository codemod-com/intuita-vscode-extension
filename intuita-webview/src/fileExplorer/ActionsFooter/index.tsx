import {
	VSCodeButton,
	VSCodeProgressRing,
} from '@vscode/webview-ui-toolkit/react';
import IntuitaPopover from '../../shared/IntuitaPopover';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import { CaseHash } from '../../../../src/cases/types';

const POPOVER_TEXTS = {
	discard: 'Discard all the proposed changes for the highlighted codemod.',
	apply: 'Save selected changes to file(s) and discard all the deselected changes.',
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
	applySelectedInProgress: boolean;
	screenWidth: number | null;
}>;

export const ActionsFooter = ({
	caseHash,
	selectedJobCount,
	screenWidth,
	applySelectedInProgress,
}: Props) => {
	return (
		<div
			className={styles.root}
			style={{
				...(screenWidth !== null &&
					screenWidth >= 330 && { justifyContent: 'flex-end' }),
			}}
		>
			<IntuitaPopover content={POPOVER_TEXTS.discard}>
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
			</IntuitaPopover>
			<IntuitaPopover
				content={
					selectedJobCount === 0
						? POPOVER_TEXTS.cannotApply
						: POPOVER_TEXTS.apply
				}
			>
				<VSCodeButton
					appearance="primary"
					onClick={(event) => {
						event.preventDefault();

						applySelected(caseHash);
					}}
					className={styles.vscodeButton}
					disabled={applySelectedInProgress}
				>
					{applySelectedInProgress && (
						<VSCodeProgressRing className={styles.progressRing} />
					)}
					{getApplyText(selectedJobCount)}
				</VSCodeButton>
			</IntuitaPopover>
		</div>
	);
};
