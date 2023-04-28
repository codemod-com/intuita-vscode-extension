import { ReactNode, useCallback, useEffect, useState } from 'react';
import Tree from './Tree';
import TreeItem from './TreeItem';
import { RunCodemodsCommand, CodemodTreeNode } from '../../shared/types';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import cn from 'classnames';
import { DirectorySelector } from '../components/DirectorySelector';
import Popup from 'reactjs-popup';
import E from 'fp-ts/Either';

type Props = {
	node?: CodemodTreeNode<string>;
	response: E.Either<Error, string | null>;
	emptyTreeMessage: string | null;
};

const getIcon = (iconName: string | null, open: boolean): ReactNode => {
	if (iconName === 'case.svg') {
		return <CaseIcon />;
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

const TreeView = ({
	node,
	response,
	emptyTreeMessage: emptyMessage,
}: Props) => {
	const [focusedNodeId, setFocusedNodeId] = useState('');
	const [editExecutionPath, setEditExecutionPath] =
		useState<CodemodTreeNode<string> | null>(null);

	useEffect(() => {
		if (response._tag === 'Right') {
			setEditExecutionPath(null);
		}
	}, [response._tag]);

	const handleClick = useCallback((node: CodemodTreeNode<string>) => {
		if (!node.command) {
			return;
		}

		vscode.postMessage({
			kind: 'webview.command',
			value: node.command,
		});
	}, []);

	const handleActionButtonClick = useCallback(
		(action: RunCodemodsCommand) => {
			vscode.postMessage(action);
		},
		[],
	);

	const handleEditExecutionPath = useCallback(
		(node: CodemodTreeNode<string>) => {
			setEditExecutionPath(node);
		},
		[],
	);

	const renderItem = ({
		node,
		depth,
		open,
		setIsOpen,
		focusedNodeId,
		setFocusedNodeId,
	}: {
		node: CodemodTreeNode<string>;
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
				key={action.kind}
				className={styles.action}
				role="button"
				onClick={(e) => {
					e.stopPropagation();
					handleActionButtonClick(action);
				}}
			>
				{action.title}
			</a>
		));

		const editExecutionPathAction = (
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			<a
				key="executionOnPath"
				className={styles.action}
				role="button"
				onClick={(e) => {
					e.stopPropagation();
					handleEditExecutionPath(node);
				}}
			>
				<i className="codicon codicon-pencil"></i> Edit Path
			</a>
		);

		return (
			<TreeItem
				disabled={false}
				hasChildren={(node.children?.length ?? 0) !== 0}
				id={node.id}
				description={node.description ?? ''}
				hoverDescription={`Target: ${node.extraData}`}
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
				actionButtons={[
					...actionButtons,
					...(node.kind === 'codemodItem'
						? [editExecutionPathAction]
						: []),
				]}
			/>
		);
	};

	if (!node || (node.children?.length ?? 0) === 0) {
		return <p> {emptyMessage} </p>;
	}

	const onEditDone = (value: string) => {
		if (!editExecutionPath) {
			return;
		}
		vscode.postMessage({
			kind: 'webview.codemodList.updatePathToExecute',
			value: {
				newPath: value,
				codemodHash: editExecutionPath.id,
			},
		});
	};

	return (
		<div>
			{editExecutionPath && (
				<Popup
					modal
					open={!!editExecutionPath}
					onClose={() => {
						setEditExecutionPath(null);
					}}
					closeOnEscape
				>
					<span
						className="codicon text-xl cursor-pointer absolute right-0 top-0 codicon-close p-3"
						onClick={() => setEditExecutionPath(null)}
					></span>
					<p className="bold">Codemod: {editExecutionPath.label}</p>

					<p> Current Path: {editExecutionPath.extraData}</p>
					<DirectorySelector
						defaultValue={editExecutionPath.extraData ?? ''}
						onEditDone={onEditDone}
						error={
							response._tag === 'Left'
								? {
										value: response.left.message,
										timestamp: Date.now(),
								  }
								: null
						}
					/>
				</Popup>
			)}

			<Tree
				node={node}
				renderItem={(props) =>
					renderItem({ ...props, setFocusedNodeId, focusedNodeId })
				}
				depth={0}
			/>
		</div>
	);
};

export default TreeView;
