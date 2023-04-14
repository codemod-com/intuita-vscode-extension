import ReactTreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';

type Props = {
	depth: number;
	node: TreeNode;
	renderItem({
		node,
		depth,
		open,
		setIsOpen,
	}: {
		node: TreeNode;
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

	return (
		<ReactTreeView collapsed={!open} nodeLabel={treeItem}>
			{open
				? node.children.map((child) => (
						<Tree
							key={child.id}
							node={child}
							renderItem={renderItem}
							depth={depth + 1}
						/>
				  ))
				: null}
		</ReactTreeView>
	);
};

export default memo(Tree);
export type { TreeNode };
