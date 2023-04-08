import TreeView from 'react-treeview';
import { ReactNode, useState } from 'react';
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
	const [open, setIsOpen] = useState(true);

	const label = renderItem(node, open, setIsOpen);

	if (!node.children?.length) {
		return <>{label}</>;
	}

	return (
		<TreeView  nodeLabel={label}>
			{true
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

export default Tree;
export type { TreeNode };
