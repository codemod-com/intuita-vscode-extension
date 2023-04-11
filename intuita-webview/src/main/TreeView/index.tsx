import { useCallback } from 'react';
import Tree from '../Tree';
import TreeItem from '../TreeItem';
import {
	Command,
	TreeNode,
} from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';

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
		depth: number,
		open: boolean,
		setIsOpen: (value: boolean) => void,
	) => {
		const icon =
			node.iconName === 'case.svg' ? <CaseIcon /> : <BlueLightBulbIcon />;
		const actionButtons = (node.actions ?? []).map((action) => (
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			<a
				title={action.title}
				role="button"
				onClick={(e) => {
					e.stopPropagation();
					handleActionButtonClick(action);
				}}
			>
				{action.title}
			</a>
		));

		return (
			<TreeItem
				hasChildren={(node.children?.length ?? 0) !== 0}
				id={node.id}
				label={node.label ?? ''}
				icon={icon}
				indent={depth * 30}
				open={open}
				onClick={() => {
					handleClick(node);
					setIsOpen(!open);
				}}
				actionButtons={actionButtons}
			/>
		);
	};

	if ((node.children?.length ?? 0) === 0) {
		return (
			<p className={styles.welcomeMessage}>
				No change to review! Run some codemods via VS Code Command &
				check back later!
			</p>
		);
	}

	return <Tree node={node} renderItem={renderItem} depth={0} />;
};

export default TreeView;
