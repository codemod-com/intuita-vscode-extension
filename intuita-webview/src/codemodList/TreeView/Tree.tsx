import ReactTreeView from 'react-treeview';
import { ReactNode } from 'react';
import { CodemodHash, CodemodTreeNode } from '../../shared/types';
import { useKey } from '../../jobDiffView/hooks/useKey';

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
	onFocusNode,
	focusedId,
}: Props) => {
	const treeItem = renderItem({ node, depth });
	const children = !searchingCodemod
		? node.children
		: node.children.filter((child) => hashesForSearch.has(child.id));

	const handleArrowKeyDown = (key: 'ArrowUp' | 'ArrowDown') => {
		const currIndex = nodeIds.findIndex((val) => val === focusedId ?? 0);
		const newIndex = key === 'ArrowUp' ? currIndex - 1 : currIndex + 1;
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
