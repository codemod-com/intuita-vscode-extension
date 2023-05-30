import ReactTreeView from 'react-treeview';
import { ReactNode } from 'react';
import { CodemodHash, CodemodTreeNode } from '../../shared/types';

type Props = {
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
};

const Tree = ({
	node,
	openedIds,
	depth,
	renderItem,
	hashesForSearch,
	searchingCodemod,
}: Props) => {
	const treeItem = renderItem({ node, depth });
	const children = !searchingCodemod
		? node.children
		: node.children.filter((child) => hashesForSearch.has(child.id));

	if (!children || children.length === 0) {
		return <>{treeItem}</>;
	}

	// don't show the root folder
	if (depth === 0) {
		return (
			<>
				{children.map((child) => (
					<Tree
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
