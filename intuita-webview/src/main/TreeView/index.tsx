import { useCallback } from 'react';
import Tree from '../Tree';
import TreeItem from './TreeItem';
import {TreeNode} from '../../../../src/components/webview/webviewEvents';
import {ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import {ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
// import {ReactComponent as Ts2Icon } from '../../assets/ts2.svg';

type Props = {
	node: TreeNode;
}; 

const TreeView = ({ node }: Props) => {

	const handleClick = useCallback((node: TreeNode) => {
		if(!node.command) {
			return;
		}
		
		vscode.postMessage({
			kind: 'webview.command', 
			value: node.command,
		})
	}, []);

	const renderItem = 	(
			node: TreeNode,
			open: boolean,
			setIsOpen: (value: boolean) => void,
		) => {
			const icon = node.iconName === 'case.svg' ? <CaseIcon /> : <BlueLightBulbIcon />;
			const actionButtons = null;

			return (
				<TreeItem
					id={node.id}
					label={node.label ?? ''}
					icon={icon}
					open={open}
					onClick={() => {
						handleClick(node);
						setIsOpen(!open);
					}}
					actionButtons={actionButtons}
				/>
			);
		};
	
		console.log(node, 'test');

	return <Tree node={node} renderItem={renderItem} />;
};

export default TreeView;
