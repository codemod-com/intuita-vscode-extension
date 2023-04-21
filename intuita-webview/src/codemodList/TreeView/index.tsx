import { ReactNode, useCallback, useState } from 'react';
import Tree from './Tree';
import TreeItem from './TreeItem';
import { Command, CodemodTreeNode } from '../../shared/types';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import cn from 'classnames';
import { VSCodeButton, VSCodeLink } from '@vscode/webview-ui-toolkit/react';

type Props = {
	node?: CodemodTreeNode<string>;
};

const getIcon = (iconName: string | null, open: boolean): ReactNode => {
	if (iconName === 'bluelightbulb.svg') {
		return <BlueLightBulbIcon />;
	}
	if (iconName === 'folder.svg') {
		return (
			<span
				className={cn(
					'codicon',
					!open ? 'codicon-folder' : 'codicon-folder-opened',
				)}
			/>
		);
	}

	return <BlueLightBulbIcon />;
};

const TreeView = ({ node }: Props) => {
	const [focusedNodeId, setFocusedNodeId] = useState('');

	const handleClick = useCallback((node: CodemodTreeNode<String>) => {
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

	const renderItem = ({
		node,
		depth,
		open,
		setIsOpen,
		focusedNodeId,
		setFocusedNodeId,
	}: {
		node: CodemodTreeNode<String>;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
		focusedNodeId: string;
		setFocusedNodeId: (value: string) => void;
	}) => {
		const icon = getIcon(node.iconName ?? null, open);

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
				disabled={false}
				hasChildren={(node.children?.length ?? 0) !== 0}
				id={node.id}
				description={node.description ?? ''}
				label={node.label ?? ''}
				icon={icon}
				depth={depth}
				kind={node.kind}
				open={open}
				focused={node.id === focusedNodeId}
				onClick={() => {
					handleClick(node);
					setIsOpen(!open);
					setFocusedNodeId(node.id);
				}}
				actionButtons={actionButtons}
			/>
		);
	};

	if (!node || (node.children?.length ?? 0) === 0) {
		return (
			<div className={styles.welcomeMessage}>
				<p>
					No available codemods right now based on package.json file.
					You can create a codemod on
					<VSCodeLink href="https://codemod.studio">
						Codemod Studio
					</VSCodeLink>
					and import it here.
				</p>
				<VSCodeButton
					className={styles['w-full']}
					onClick={(e) => {
						e.stopPropagation();
						vscode.postMessage({
							kind: 'webview.command',
							value: {
								command: 'openLink',
								arguments: ['https://codemod.studio'],
								title: 'Open Codemod Studio',
							},
						});
					}}
				>
					Open Codemod Studio
				</VSCodeButton>
			</div>
		);
	}

	return (
		<Tree
			node={node}
			renderItem={(props) =>
				renderItem({ ...props, setFocusedNodeId, focusedNodeId })
			}
			depth={0}
		/>
	);
};

export default TreeView;
