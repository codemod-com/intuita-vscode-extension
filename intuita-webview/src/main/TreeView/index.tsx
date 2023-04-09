import { useCallback } from 'react';
import Tree from '../Tree';
import TreeItem from './TreeItem';
import {
	Command,
	TreeNode,
} from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
// import {ReactComponent as Ts2Icon } from '../../assets/ts2.svg';

type Props = {
	node: TreeNode;
};

const TreeView = ({ node }: Props) => {
	const handleClick = useCallback((node: TreeNode) => {
		if (!node.command) {
			return;
		}

		vscode.postMessage({
			kind: 'webview.command',
			value: node.command,
		});
	}, []);

	const handleActionButtonClick = (action: Command) => {
		vscode.postMessage({ kind: 'webview.command', value: action });
	};

	const renderItem = (
		node: TreeNode,
		open: boolean,
		setIsOpen: (value: boolean) => void,
	) => {
		const icon =
			node.iconName === 'case.svg' ? <CaseIcon /> : <BlueLightBulbIcon />;
		// eslint-disable-next-line jsx-a11y/anchor-is-valid
		const actionButtons = (node.actions ?? []).map((action) => (
			<a
				title={action.title}
				role="button"
				onClick={() => {
					handleActionButtonClick(action);
				}}
			>
				{action.title}{' '}
			</a>
		));

		return (
			<TreeItem
				hasChildren={Boolean(node.children?.length)}
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
