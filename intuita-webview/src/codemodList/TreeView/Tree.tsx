import ReactTreeView from 'react-treeview';
import { ReactNode } from 'react';
import { CodemodHash, CodemodTreeNode } from '../../shared/types';
import { useKey } from '../../jobDiffView/hooks/useKey';

const getIndex = (
	nodes: ReadonlyArray<CodemodTreeNode>,
	hash: CodemodHash | null,
): number => {
	return nodes.findIndex((_node) => hash === _node.id);
};

type Props = {
	rootPath: string;
	depth: number;
	openedIds: ReadonlySet<CodemodHash>;
	node: CodemodTreeNode;
	renderItem({
		node,
		depth,
	}: {
		node: CodemodTreeNode;
		depth: number;
	}): ReactNode;
	hashesForSearch: ReadonlySet<CodemodHash>;
	searchingCodemod: boolean;
	nodeIds: ReadonlyArray<CodemodHash>;
	nodesByDepth: ReadonlyArray<ReadonlyArray<CodemodTreeNode>>;
	onFocusNode(id: CodemodHash): void;
	focusedId: CodemodHash | null;
};

const Tree = ({
	rootPath,
	node,
	openedIds,
	depth,
	renderItem,
	hashesForSearch,
	searchingCodemod,
	nodeIds,
	nodesByDepth,
	onFocusNode,
	focusedId,
}: Props) => {
	const treeItem = renderItem({ node, depth });
	const children = !searchingCodemod
		? node.children
		: node.children.filter((child) => hashesForSearch.has(child.id));

	const handleArrowKeyDown = (key: 'ArrowUp' | 'ArrowDown') => {
		if (node.id !== focusedId) {
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
			const nodesAtPrevDepth: ReadonlyArray<CodemodTreeNode> =
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
			const nodesAtNextDepth: ReadonlyArray<CodemodTreeNode> =
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
			(val) => val === focusedId ?? 0,
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
		handleArrowKeyDown('ArrowUp');
	});

	useKey('ArrowDown', () => {
		handleArrowKeyDown('ArrowDown');
	});

	if (!children || children.length === 0) {
		return node.label === rootPath ? null : <>{treeItem}</>;
	}

	// don't show the root folder
	if (depth === 0) {
		return (
			<>
				{children.map((child) => (
					<Tree
						rootPath={rootPath}
						focusedId={focusedId}
						nodeIds={nodeIds}
						nodesByDepth={nodesByDepth}
						onFocusNode={onFocusNode}
						searchingCodemod={searchingCodemod}
						hashesForSearch={hashesForSearch}
						key={child.id}
						node={child}
						depth={depth + 1}
						renderItem={renderItem}
						openedIds={openedIds}
					/>
				))}
			</>
		);
	}

	return (
		<ReactTreeView collapsed={!openedIds.has(node.id)} nodeLabel={treeItem}>
			{children.map((child) => (
				<Tree
					rootPath={rootPath}
					focusedId={focusedId}
					nodeIds={nodeIds}
					nodesByDepth={nodesByDepth}
					onFocusNode={onFocusNode}
					hashesForSearch={hashesForSearch}
					searchingCodemod={searchingCodemod}
					key={child.id}
					node={child}
					depth={depth + 1}
					renderItem={renderItem}
					openedIds={openedIds}
				/>
			))}
		</ReactTreeView>
	);
};

export default Tree;
export type { CodemodTreeNode };
