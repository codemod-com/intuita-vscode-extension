import { ReactNode, useCallback, useEffect, useState } from 'react';
import Tree from './Tree';
import TreeItem from './TreeItem';
import {
	RunCodemodsCommand,
	CodemodTreeNode,
	CodemodHash,
	WebviewMessage,
} from '../../shared/types';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { vscode } from '../../shared/utilities/vscode';
import styles from './style.module.css';
import cn from 'classnames';
import { DirectorySelector } from '../components/DirectorySelector';
import Popup from 'reactjs-popup';
import E from 'fp-ts/Either';
import { useProgressBar } from '../useProgressBar';

type Props = Readonly<{
	node: CodemodTreeNode<string>;
	response: E.Either<Error, string | null>;
}>;

export const containsCodemodHashDigest = (
	node: CodemodTreeNode<string>,
	codemodHashDigest: CodemodHash,
	set: Set<CodemodHash>,
): boolean => {
	if (node.id === codemodHashDigest) {
		set.add(node.id);
		return true;
	}

	const someChildContains = node.children.some((childNode) =>
		containsCodemodHashDigest(childNode, codemodHashDigest, set),
	);

	if (someChildContains) {
		set.add(node.id);
	}

	return someChildContains;
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

const TreeView = ({ node, response }: Props) => {
	const [openedIds, setOpenedIds] = useState<ReadonlySet<CodemodHash>>(
		new Set([node.id]),
	);
	const [focusedNodeId, setFocusedNodeId] = useState<CodemodHash | null>(
		null,
	);
	const [editExecutionPath, setEditExecutionPath] =
		useState<CodemodTreeNode<string> | null>(null);
	const [executionStack, setExecutionStack] = useState<
		ReadonlyArray<CodemodHash>
	>([]);

	const onHalt = useCallback(() => {
		if (!executionStack.length) {
			return;
		}
		const stack = executionStack.slice();
		const hash = stack.shift();

		if (!hash) {
			return;
		}

		setExecutionStack(stack);

		vscode.postMessage({
			kind: 'webview.codemodList.dryRunCodemod',
			value: hash,
		});
	}, [executionStack]);

	const [progress, { progressBar, stopProgress }] = useProgressBar(onHalt);

	useEffect(() => {
		if (response._tag === 'Right') {
			setEditExecutionPath(null);
		}
	}, [response]);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.codemods.focusCodemod') {
				const { codemodHashDigest } = message;

				setOpenedIds((oldOpenedIds) => {
					const newOpenedIds = new Set(oldOpenedIds);

					containsCodemodHashDigest(
						node,
						codemodHashDigest,
						newOpenedIds,
					);

					return newOpenedIds;
				});

				setFocusedNodeId(codemodHashDigest);
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, [node]);

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
			if (
				(progress || executionStack.length) &&
				action.kind === 'webview.codemodList.dryRunCodemod'
			) {
				if (executionStack.includes(action.value)) {
					return;
				}
				setExecutionStack((prev) => [...prev, action.value]);
				return;
			}

			vscode.postMessage(action);
		},
		[executionStack, progress],
	);

	const handleEditExecutionPath = useCallback(
		(node: CodemodTreeNode<string>) => {
			setEditExecutionPath(node);
		},
		[],
	);

	const flipTreeItem = (id: CodemodHash) => {
		setOpenedIds((oldSet) => {
			const newSet = new Set(oldSet);

			if (oldSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}

			return newSet;
		});
	};

	const renderItem = ({
		node,
		depth,
	}: {
		node: CodemodTreeNode<string>;
		depth: number;
	}) => {
		const opened = openedIds.has(node.id);

		const icon = getIcon(node.iconName ?? null, opened);

		const actionButtons = (node.actions ?? []).map((action) => (
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			<a
				key={action.kind}
				className={styles.action}
				role="button"
				title={`${
					action.kind === 'webview.codemodList.dryRunCodemod' &&
					executionStack.includes(action.value)
						? 'Queued:'
						: ''
				} ${action.description}`}
				onClick={(e) => {
					e.stopPropagation();
					handleActionButtonClick(action);
				}}
			>
				{action.kind === 'webview.codemodList.dryRunCodemod' &&
					executionStack.includes(action.value) && (
						<i className="codicon codicon-history mr-2" />
					)}
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
				title="Edit Execution Path"
			>
				<i className="codicon codicon-pencil"></i> Edit Path
			</a>
		);

		const getActionButtons = () => {
			if (progress?.codemodHash === node.id) {
				return [stopProgress];
			}
			return [
				...actionButtons,
				...(node.kind === 'codemodItem'
					? [editExecutionPathAction]
					: []),
			];
		};

		return (
			<TreeItem
				progressBar={
					progress?.codemodHash === node.id ? progressBar : null
				}
				disabled={false}
				hasChildren={(node.children?.length ?? 0) !== 0}
				id={node.id}
				description={node.description ?? ''}
				hoverDescription={`Target: ${node.extraData}`}
				label={node.label ?? ''}
				icon={icon}
				depth={depth}
				kind={node.kind}
				open={opened}
				focused={node.id === focusedNodeId}
				onClick={() => {
					handleClick(node);
					flipTreeItem(node.id);
					setFocusedNodeId(node.id);
				}}
				actionButtons={getActionButtons()}
			/>
		);
	};

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
				renderItem={renderItem}
				depth={0}
				openedIds={openedIds}
			/>
		</div>
	);
};

export default TreeView;
