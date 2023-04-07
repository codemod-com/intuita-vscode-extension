import { useCallback } from 'react';
import Tree, { TreeNode } from '../Tree';
import TreeItem from './TreeItem';

type Props = {
	node: TreeNode;
}; 

const TreeView = ({ node }: Props) => {
	const handleClick = useCallback((node: TreeNode) => {
		console.log(node);
	}, []);

	const renderItem = useCallback(
		(
			node: TreeNode,
			open: boolean,
			setIsOpen: (value: boolean) => void,
		) => {
			const icon = null;
			const actionButtons = null;

			return (
				<TreeItem
					id={node.id}
					label={node.label}
					icon={icon}
					onClick={() => {
						handleClick(node);
						setIsOpen(!open);
					}}
					actionButtons={actionButtons}
				/>
			);
		},
		[handleClick],
	);

	return <Tree node={node} renderItem={renderItem} />;
};

export default TreeView;
