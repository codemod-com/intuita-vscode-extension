import TreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';

type Props = {
	depth?: number,
	node: TreeNode;
	renderItem(
		node: TreeNode,
		depth: number, 
		open: boolean,
		setIsOpen: (value: boolean) => void,
	): ReactNode;
};

const Tree = ({ node, depth=0, renderItem }: Props) => {
	const [open, setIsOpen] = useState(false);

	const label = renderItem(node, depth, open, setIsOpen);

	if (!node.children?.length) {
		return <>{label}</>;
	}

	return (
		<TreeView collapsed={!open} nodeLabel={label}>
			{open
				? node.children.map((child, index) => (
						<Tree
							key={index}
							node={child}
							renderItem={renderItem}
							depth={depth+1}
						/>
				  ))
				: null}
		</TreeView>
	);
};

export default memo(Tree);
export type { TreeNode };
