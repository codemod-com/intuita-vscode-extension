import TreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';

type Props = {
	node: TreeNode;
	renderItem(
		node: TreeNode,
		open: boolean,
		setIsOpen: (value: boolean) => void,
	): ReactNode;
};

type TreeNode = {
	id: string;
	label: string;
	children?: TreeNode[];
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
