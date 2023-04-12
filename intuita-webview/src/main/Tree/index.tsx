import ReactTreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';

type Props = {
	depth: number;
	node: TreeNode;
	renderItem(
		node: TreeNode,
		depth: number,
		open: boolean,
		setIsOpen: (value: boolean) => void,
	): ReactNode;
};

const Tree = ({ node, depth = 0, renderItem }: Props) => {
	const [open, setIsOpen] = useState(false);

	const label = renderItem(node, depth, open, setIsOpen);

	if (!node.children || node.children.length === 0) {
		return <>{label}</>;
	}

	return (
		<ReactTreeView collapsed={!open} nodeLabel={label}>
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
