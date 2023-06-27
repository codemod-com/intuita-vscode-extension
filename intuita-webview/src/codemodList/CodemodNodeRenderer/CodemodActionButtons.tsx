import { memo } from 'react';
import { CodemodNode } from '../../../../src/selectors/selectCodemodTree';
import { CodemodHash } from '../../shared/types';
import { vscode } from '../../shared/utilities/vscode';
import ActionButton from '../TreeView/ActionButton';

type Props = {
	hashDigest: CodemodNode['hashDigest'];
	codemodInProgress: boolean;
	notEnoughSpace: boolean;
};

const CodemodActionButtons = ({
	hashDigest,
	codemodInProgress,
	notEnoughSpace,
}: Props) => {
	if (!codemodInProgress) {
		return (
			<ActionButton
				popoverText="Run this codemod without making change to file system"
				onClick={(e) => {
					e.stopPropagation();

					vscode.postMessage({
						kind: 'webview.codemodList.dryRunCodemod',
						value: hashDigest as unknown as CodemodHash,
					});
				}}
			>
				{notEnoughSpace ? '✓' : '✓ Dry Run'}
			</ActionButton>
		);
	}

	return (
		<ActionButton
			popoverText="Stop Codemod Execution"
			iconName="codicon-debug-stop"
			onClick={(e) => {
				e.stopPropagation();
				vscode.postMessage({
					kind: 'webview.codemodList.haltCodemodExecution',
					value: hashDigest as unknown as CodemodHash,
				});
			}}
		/>
	);
};

export default memo(CodemodActionButtons);
