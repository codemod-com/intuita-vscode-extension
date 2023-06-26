import { useCallback, useState } from 'react';

import { CodemodHash } from '../../shared/types';
import { vscode } from '../../shared/utilities/vscode';

import { useProgressBar } from '../useProgressBar';

import {
	CodemodNode,
	CodemodNodeHashDigest,
	CodemodTree,
} from '../../../../src/selectors/selectCodemodTree';

import { IntuitaTreeView } from '../../intuitaTreeView';
import { getCodemodNodeRenderer } from '../CodemodNodeRenderer';

import ActionButton from './actionButton';

type Props = Readonly<{
	tree: CodemodTree;
	autocompleteItems: string[];
	rootPath: string;
}>;

const onFocus = (hashDigest: CodemodNodeHashDigest) => {
	vscode.postMessage({
		kind: 'webview.global.selectCodemodNodeHashDigest',
		selectedCodemodNodeHashDigest: hashDigest,
	});
};

const onFlip = (hashDigest: CodemodNodeHashDigest) => {
	vscode.postMessage({
		kind: 'webview.global.flipCodemodHashDigest',
		codemodNodeHashDigest: hashDigest,
	});

	onFocus(hashDigest);
};

const TreeView = ({ tree, autocompleteItems, rootPath }: Props) => {
	/**
	 * Progress bar
	 * @TODO hide progress bar logic
	 */
	const [executionStack, setExecutionStack] = useState<
		ReadonlyArray<CodemodNodeHashDigest>
	>([]);

	const onHalt = useCallback(() => {
		if (!executionStack.length) {
			return;
		}
		const stack = executionStack.slice();
		const hash = stack.shift();

		if (!hash) {
			return;
		}

		setExecutionStack(stack);
		vscode.postMessage({
			kind: 'webview.codemodList.dryRunCodemod',
			value: hash as unknown as CodemodHash,
		});
	}, [executionStack]);

	const [progress, { progressBar }] = useProgressBar(onHalt);

	const getActionButtons = (
		node: CodemodNode,
	) => {
		if (node.kind !== 'CODEMOD') {
			return null;
		}

		const codemodIsInProgress =
			(node.hashDigest as unknown as CodemodHash) ===
			progress?.codemodHash;

		if (!codemodIsInProgress) {
			const queued = executionStack.includes(node.hashDigest);

			if (queued) {
				return (
					<ActionButton
						popoverText="Codemod execution is queued"
						iconName="codicon-history"
						onClick={(e) => {
							e.stopPropagation();
						}}
					/>
				);
			}

			return (
				<ActionButton
					popoverText="Run this codemod without making change to file system"
					onClick={(e) => {
						e.stopPropagation();

						if (executionStack.includes(node.hashDigest)) {
							return;
						}

						setExecutionStack((prev) => [...prev, node.hashDigest]);

						vscode.postMessage({
							kind: 'webview.codemodList.dryRunCodemod',
							value: node.hashDigest as unknown as CodemodHash,
						});
					}}
				>
					✓ Dry Run
				</ActionButton>
			);
		}

		if (node.codemodKind === 'executeCodemod') {
			return (
				<ActionButton
					popoverText="Stop Codemod Execution"
					iconName="codicon-debug-stop"
					onClick={(e) => {
						e.stopPropagation();
						vscode.postMessage({
							kind: 'webview.codemodList.haltCodemodExecution',
							value: node.hashDigest as unknown as CodemodHash,
						});
						
						onHalt();
					}}
				/>
			);
		}

		return null;
	};

	return (
		<IntuitaTreeView<CodemodNodeHashDigest, CodemodNode>
			{...tree}
			nodeRenderer={getCodemodNodeRenderer({
				autocompleteItems,
				rootPath,
				progressBar: (node: CodemodNode) =>
					progress?.codemodHash ===
					(node.hashDigest as unknown as CodemodHash)
						? progressBar
						: null,
				actionButtons: getActionButtons
			})}
			onFlip={onFlip}
			onFocus={onFocus}
		/>
	);
};

export default TreeView;
