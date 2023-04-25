import ReactTreeView from 'react-treeview';
import { ReactNode, memo, useState } from 'react';
import { TreeNode } from '../../../../src/components/webview/webviewEvents';
import { buildHash, generateColor } from '../../utilities';

type Props = {
	index: number;
	depth: number;
	node: TreeNode;
	renderItem({
		index,
		node,
		depth,
		open,
		setIsOpen,
		color,
		lastChild,
	}: {
		index: number;
		node: TreeNode;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
		color: string;
		lastChild: boolean;
	}): ReactNode;
	color: string;
	lastChild: boolean;
};

const Tree = ({
	node,
	depth,
	renderItem,
	color: colorProp,
	index,
	lastChild,
}: Props) => {
	const hasNoChildren = !node.children || node.children.length === 0;
	const [open, setIsOpen] = useState(true);
	const [color] = useState(
		hasNoChildren ? colorProp : generateColor(buildHash(node.id)),
	);
	const treeItem = renderItem({
		index,
		lastChild,
		color,
		node,
		depth,
		open,
		setIsOpen,
	});

	if (hasNoChildren) {
		return <>{treeItem}</>;
	}

	return (
		<>
			<ReactTreeView collapsed={!open} nodeLabel={treeItem}>
				{open
					? node.children.map((child, index, arr) => (
							<Tree
								key={child.id}
								node={child}
								renderItem={renderItem}
								depth={depth + 1}
								color={color}
								index={index}
								lastChild={arr.length - 1 === index}
							/>
					  ))
					: null}
			</ReactTreeView>
		</>
	);
};

export default memo(Tree);
export type { TreeNode };
