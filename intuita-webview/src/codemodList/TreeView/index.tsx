import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react';
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
import { useProgressBar } from '../useProgressBar';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

type Props = Readonly<{
	node: CodemodTreeNode;
	autocompleteItems: string[];
	openedIds: ReadonlySet<CodemodHash>;
	focusedId: CodemodHash | null;
}>;

export const containsCodemodHashDigest = (
	node: CodemodTreeNode,
	codemodHashDigest: CodemodHash,
	set: Set<CodemodHash>,
): boolean => {
	if (node.id === codemodHashDigest) {
		// set.add(node.id);

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

type State = Readonly<{
	node: CodemodTreeNode;
	openedIds: ReadonlySet<CodemodHash>;
	focusedId: CodemodHash | null;
}>;

type InitializerArgument = State;

type Action = Readonly<{
	kind: 'focus' | 'flip';
	id: CodemodHash;
}>;

const reducer = (state: State, action: Action): State => {
	if (action.kind === 'focus') {
		const openedIds = new Set(state.openedIds);

		containsCodemodHashDigest(state.node, action.id, openedIds);

		return {
			node: state.node,
			openedIds,
			focusedId: action.id,
		};
	}

	if (action.kind === 'flip') {
		const openedIds = new Set(state.openedIds);

		if (openedIds.has(action.id)) {
			openedIds.delete(action.id);
		} else {
			openedIds.add(action.id);
		}

		return {
			node: state.node,
			openedIds,
			focusedId: action.id,
		};
	}

	return state;
};

const initializer = ({
	node,
	focusedId,
	openedIds,
}: InitializerArgument): State => {
	const newOpenedIds = new Set([...openedIds, node.id]);

	if (focusedId !== null) {
		containsCodemodHashDigest(node, focusedId, newOpenedIds);
	}

	return {
		node,
		openedIds: newOpenedIds,
		focusedId,
	};
};

const TreeView = ({ node, autocompleteItems, openedIds, focusedId }: Props) => {
	const rootPath = node.label;
	const [state, dispatch] = useReducer(
		reducer,
		{
			node,
			focusedId,
			openedIds,
		},
		initializer,
	);

	const [executionStack, setExecutionStack] = useState<
		ReadonlyArray<CodemodHash>
	>([]);
	const [runningRepomodHash, setRunningRepomodHash] =
		useState<CodemodHash | null>(null);

	useEffect(() => {
		vscode.postMessage({
			kind: 'webview.codemods.setState',
			openedIds: Array.from(state.openedIds),
			focusedId: state.focusedId,
		});
	}, [state]);

	const onHalt = useCallback(() => {
		setRunningRepomodHash(null);

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

	const [progress, { progressBar, stopProgress }] = useProgressBar(
		onHalt,
		runningRepomodHash,
	);

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.codemods.focusCodemod') {
				dispatch({
					kind: 'focus',
					id: message.codemodHashDigest,
				});
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, [node]);

	const handleClick = useCallback((node: CodemodTreeNode) => {
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

	const renderItem = ({
		node,
		depth,
	}: {
		node: CodemodTreeNode;
		depth: number;
	}) => {
		const opened = state.openedIds.has(node.id);

		const icon = getIcon(node.iconName ?? null, opened);

		const actionButtons = (node.actions ?? []).map((action) => {
			return (
				<VSCodeButton
					key={action.kind}
					className={styles.action}
					appearance="icon"
					title={`${
						action.kind === 'webview.codemodList.dryRunCodemod' &&
						executionStack.includes(action.value)
							? 'Queued:'
							: ''
					} ${action.description}`}
					onClick={(e) => {
						e.stopPropagation();
						handleActionButtonClick(action);
						if (
							action.kind ===
								'webview.codemodList.dryRunCodemod' &&
							node.modKind === 'repomod'
						) {
							setRunningRepomodHash(node.id);
						}
					}}
				>
					{action.kind === 'webview.codemodList.dryRunCodemod' &&
						executionStack.includes(action.value) && (
							<i className="codicon codicon-history mr-2" />
						)}
					{action.title}
				</VSCodeButton>
			);
		});

		const getActionButtons = () => {
			if (node.modKind === 'repomod' && runningRepomodHash !== null) {
				return [];
			}

			if (
				progress?.codemodHash === node.id &&
				node.modKind === 'executeCodemod'
			) {
				return [stopProgress];
			}

			return actionButtons;
		};

		return (
			<TreeItem
				progressBar={
					progress?.codemodHash === node.id ? progressBar : null
				}
				disabled={false}
				hasChildren={(node.children?.length ?? 0) !== 0}
				id={node.id}
				executionPath={node.executionPath}
				rootPath={rootPath}
				description={node.description ?? ''}
				label={node.label ?? ''}
				icon={icon}
				depth={depth}
				kind={node.kind}
				open={opened}
				focused={node.id === state.focusedId}
				autocompleteItems={autocompleteItems}
				onClick={() => {
					handleClick(node);

					dispatch({
						kind: 'flip',
						id: node.id,
					});
				}}
				actionButtons={getActionButtons()}
			/>
		);
	};

	return (
		<div>
			<Tree
				node={node}
				renderItem={renderItem}
				depth={0}
				openedIds={state.openedIds}
			/>
		</div>
	);
};

export default TreeView;
