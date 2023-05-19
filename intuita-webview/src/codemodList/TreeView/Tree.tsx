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
};

const Tree = ({ node, openedIds, depth, renderItem }: Props) => {
	const treeItem = renderItem({ node, depth });

	if (!node.children || node.children.length === 0) {
		return <>{treeItem}</>;
	}
	// don't show the root folder
	if (depth === 0) {
		return (
			<>
				{node.children.map((child) => (
					<Tree
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
			{node.children.map((child) => (
				<Tree
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
