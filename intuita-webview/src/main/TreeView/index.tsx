import { useCallback } from 'react';
import Tree from '../Tree';
import TreeItem from '../TreeItem';
import {
	Command,
	TreeNode,
} from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { ReactComponent as TS2Icon } from '../../assets/ts2.svg';
import { ReactComponent as FolderIcon } from '../../assets/folder.svg';
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
		let icon = null;
		switch (node.iconName) {
			case 'case.svg':
				icon = <CaseIcon />;
				break;
			case 'bluelightbulb.svg':
				icon = <BlueLightBulbIcon />;
				break;
			case 'ts2.svg':
				icon = <TS2Icon />;
				break;
			case 'folder.svg':
				icon = <FolderIcon />;
				break;
			default:
				icon = <BlueLightBulbIcon />;
				break;
		}

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
