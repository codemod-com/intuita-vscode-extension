import { useState } from 'react';

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

function useQueue<T>() {
	const [queue, setQueue] = useState<T[]>([]);

	return {
		enqueue: (item: T) => setQueue((prev) => [item, ...prev]),
		dequeue: () => {
			const nextQueue = queue.slice();
			const item = nextQueue.shift();

			setQueue(nextQueue);

			return item;
		},
		queued: (item: T) => queue.includes(item), 
	};
}

const TreeView = ({ tree, autocompleteItems, rootPath }: Props) => {
	const { queued, enqueue, dequeue } = useQueue<CodemodNodeHashDigest>();

	const onHalt = () => {
		const nextHash = dequeue();
		
		vscode.postMessage({
			kind: 'webview.codemodList.dryRunCodemod',
			value: nextHash as unknown as CodemodHash,
		});
	};

	const progress = useProgressBar(onHalt);

	const getActionButtons = (node: CodemodNode) => {
		if (node.kind !== 'CODEMOD') {
			return null;
		}

		const codemodIsInProgress =
			(node.hashDigest as unknown as CodemodHash) ===
			progress?.codemodHash;

		if (!codemodIsInProgress) {
			if (queued(node.hashDigest)) {
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

						if (queued(node.hashDigest)) {
							return;
						}

						enqueue(node.hashDigest);

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
				getProgress: (node: CodemodNode) =>
					progress?.codemodHash ===
					(node.hashDigest as unknown as CodemodHash)
						? progress.progress
						: null,
				actionButtons: getActionButtons,
			})}
			onFlip={onFlip}
			onFocus={onFocus}
		/>
	);
};

export default TreeView;
