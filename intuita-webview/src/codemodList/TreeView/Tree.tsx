import ReactTreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { CodemodTreeNode } from '../../shared/types';

type Props = {
	depth: number;
	node: CodemodTreeNode<string>;
	renderItem({
		node,
		depth,
		open,
		setIsOpen,
	}: {
		node: CodemodTreeNode<string>;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
	}): ReactNode;
};

const Tree = ({ node, depth = 0, renderItem }: Props) => {
	const [open, setIsOpen] = useState(depth === 0);

	const treeItem = renderItem({ node, depth, open, setIsOpen });

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
					/>
				))}
			</>
		);
	}

	return (
		<ReactTreeView collapsed={!open} nodeLabel={treeItem}>
			{node.children.map((child) => (
				<Tree
					key={child.id}
					node={child}
					depth={depth + 1}
					renderItem={renderItem}
				/>
			))}
		</ReactTreeView>
	);
};

export default memo(Tree);
export type { CodemodTreeNode };
