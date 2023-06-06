import ReactTreeView from 'react-treeview';
import { Dispatch, ReactNode, SetStateAction, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';
import { useKey } from '../../jobDiffView/hooks/useKey';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';

const getIndex = (
	nodes: ReadonlyArray<TreeNode>,
	id: string | null,
): number => {
	return nodes.findIndex((_node) => id === _node.id);
};

type Props = {
	index: number;
	depth: number;
	node: TreeNode;
	renderItem({
		index,
		node,
		depth,
		open,
		setIsOpen,
	}: {
		index: number;
		node: TreeNode;
		depth: number;
		open: boolean;
		setIsOpen: Dispatch<SetStateAction<boolean>>;
	}): ReactNode;
	focusedNodeId: string | null;
	allFileNodesReady: boolean;
	nodeIds: string[];
	nodesByDepth: ReadonlyArray<ReadonlyArray<TreeNode>>;
	onFocusNode(id: string): void;
};

const Tree = ({
	node,
	focusedNodeId,
	depth,
	renderItem,
	index,
	allFileNodesReady,
	nodeIds,
	nodesByDepth,
	onFocusNode,
}: Props) => {
	const hasNoChildren = !node.children || node.children.length === 0;
	const [open, setIsOpen] = useState(true);

	const handleArrowKeyDownHorizontal = (key: 'ArrowLeft' | 'ArrowRight') => {
		if (node.id !== focusedNodeId) {
			return;
		}

		if (key === 'ArrowRight' && (hasNoChildren || open)) {
			vscode.postMessage({
				kind: 'webview.global.focusView',
				webviewName: 'diffView',
			});
			return;
		}

		if (!hasNoChildren) {
			setIsOpen(key === 'ArrowLeft' ? false : true);
		}
	};

	useKey('ArrowLeft', () => {
		handleArrowKeyDownHorizontal('ArrowLeft');
	});

	useKey('ArrowRight', () => {
		handleArrowKeyDownHorizontal('ArrowRight');
	});

	const handleArrowKeyDownVertical = (key: 'ArrowUp' | 'ArrowDown') => {
		if (node.id !== focusedNodeId) {
			return;
		}

		const nodesAtCurrentDepth = nodesByDepth[depth] ?? [];
		const indexAmongNodesAtCurrentDepth = getIndex(
			nodesAtCurrentDepth,
			node.id,
		);
		if (indexAmongNodesAtCurrentDepth === -1) {
			return;
		}

		if (
			key === 'ArrowDown' &&
			node.kind === 'path' &&
			!openedIds.has(node.id)
		) {
			// if exists, shift to the next sibling
			const nextNodeAtCurrentDepth =
				nodesAtCurrentDepth[indexAmongNodesAtCurrentDepth + 1] ?? null;
			if (
				nextNodeAtCurrentDepth !== null &&
				nextNodeAtCurrentDepth.parentId === node.parentId
			) {
				onFocusNode(nextNodeAtCurrentDepth.id);
				return;
			}

			// since the next sibling doesn't exist,
			// shift to the parent's next sibling
			const nodesAtPrevDepth: ReadonlyArray<TreeNode> =
				nodesByDepth[depth - 1] ?? [];
			const parentIndexInNodesByDepth = getIndex(
				nodesAtPrevDepth,
				node.parentId,
			);

			if (parentIndexInNodesByDepth === -1) {
				return;
			}

			const parentNextSiblingNode =
				nodesAtPrevDepth[parentIndexInNodesByDepth + 1] ?? null;

			if (parentNextSiblingNode === null) {
				return;
			}

			onFocusNode(parentNextSiblingNode.id);
			return;
		}

		const prevNodeAtCurrentDepth =
			nodesAtCurrentDepth[indexAmongNodesAtCurrentDepth - 1] ?? null;

		if (
			key === 'ArrowUp' &&
			node.kind === 'path' &&
			prevNodeAtCurrentDepth !== null &&
			prevNodeAtCurrentDepth.parentId === node.parentId
		) {
			// if exists and collapsed, shift to the previous sibling
			if (!openedIds.has(prevNodeAtCurrentDepth.id)) {
				onFocusNode(prevNodeAtCurrentDepth.id);
				return;
			}

			// since the previous sibling is expanded,
			// if collapsed, shift to the child's last sibling
			const nodesAtNextDepth: ReadonlyArray<TreeNode> =
				nodesByDepth[depth + 1] ?? [];
			const lastChildInNodesByDepth =
				nodesAtNextDepth
					.slice()
					.reverse()
					.find(
						(node) => node.parentId === prevNodeAtCurrentDepth.id,
					) ?? null;

			if (
				lastChildInNodesByDepth !== null &&
				!openedIds.has(lastChildInNodesByDepth.id)
			) {
				onFocusNode(lastChildInNodesByDepth.id);
				return;
			}
		}

		const currIndexInAllNodes = nodeIds.findIndex(
			(val) => val === focusedNodeId ?? 0,
		);
		const newIndex =
			key === 'ArrowUp'
				? currIndexInAllNodes - 1
				: currIndexInAllNodes + 1;
		const nodeIdToFocus = nodeIds[newIndex] ?? null;

		if (nodeIdToFocus === null) {
			return;
		}
		onFocusNode(nodeIdToFocus);
	};

	useKey('ArrowUp', () => {
		handleArrowKeyDownVertical('ArrowUp');
	});
	useKey('ArrowDown', () => {
		handleArrowKeyDownVertical('ArrowDown');
	});

	const treeItem = renderItem({
		index,
		node,
		depth,
		open,
		setIsOpen,
	});

	if (hasNoChildren) {
		return <>{treeItem}</>;
	}

	return (
		<>
			<ReactTreeView
				collapsed={!open}
				nodeLabel={treeItem}
				treeViewClassName={
					!allFileNodesReady ? styles.disabled : undefined
				}
			>
				{open
					? node.children.map((child, index) => (
							<Tree
								allFileNodesReady={allFileNodesReady}
								key={child.id}
								node={child}
								renderItem={renderItem}
								depth={depth + 1}
								index={index}
								focusedNodeId={focusedNodeId}
								nodesByDepth={nodesByDepth}
								nodeIds={nodeIds}
								onFocusNode={onFocusNode}
							/>
					  ))
					: null}
			</ReactTreeView>
		</>
	);
};

export default memo(Tree);
export type { TreeNode };
