import TreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';

type Props = {
	node: TreeNode;
	renderItem(
		node: TreeNode,
		open: boolean,
		setIsOpen: (value: boolean) => void,
	): ReactNode;
};

const Tree = ({ node, renderItem }: Props) => {
	const [open, setIsOpen] = useState(false);

	const label = renderItem(node, open, setIsOpen);

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
						/>
				  ))
				: null}
		</TreeView>
	);
};

export default memo(Tree);
export type { TreeNode };
