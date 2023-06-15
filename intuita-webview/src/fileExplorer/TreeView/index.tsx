import ReactTreeView from 'react-treeview';
import {
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
} from 'react';
import Tree from '../Tree';
import {
	FileTreeNode,
	JobHash,
	TreeNode,
	TreeNodeId,
	WebviewMessage,
} from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
import cn from 'classnames';
import { SEARCH_QUERY_MIN_LENGTH } from '../../shared/SearchBar';
import TreeItem from '../../shared/TreeItem';
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import { CaseHash } from '../../../../src/cases/types';
import debounce from '../../shared/utilities/debounce';

const getIcon = (iconName: string | null, open: boolean): ReactNode => {
	if (iconName === null) {
		return <BlueLightBulbIcon />;
	}

	let icon = null;
	switch (iconName) {
		case 'case.svg':
			icon = <CaseIcon />;
			break;
		case 'bluelightbulb.svg':
			icon = <BlueLightBulbIcon />;
			break;
		case 'file.svg':
			icon = <span className={cn('codicon', 'codicon-file')} />;
			break;
		case 'newFile.svg':
			icon = <span className={cn('codicon', 'codicon-file-add')} />;
			break;
		case 'folder.svg':
			icon = (
				<span
					className={cn(
						'codicon',
						!open ? 'codicon-folder' : 'codicon-folder-opened',
					)}
				/>
			);
			break;
	}
	return icon;
};

export const containsNodeId = (
	node: TreeNode,
	id: TreeNodeId,
	set: Set<TreeNodeId>,
): boolean => {
	if (node.id === id) {
		return true;
	}

	const someChildContains = node.children.some((childNode) =>
		containsNodeId(childNode, id, set),
	);

	if (someChildContains) {
		set.add(node.id);
	}

	return someChildContains;
};

type State = Readonly<{
	node: TreeNode;
	openedIds: ReadonlySet<TreeNodeId>;
	focusedId: TreeNodeId | null;
}>;

type InitializerArgument = State;

type Action = Readonly<{
	kind: 'focus' | 'blur' | 'flip' | 'open' | 'close';
	id: TreeNodeId | null;
}>;

const reducer = (state: State, action: Action): State => {
	const openedIds = new Set(state.openedIds);

	if (action.kind === 'blur') {
		return {
			node: state.node,
			openedIds,
			focusedId: null,
		};
	}

	if (action.kind === 'focus' && action.id !== null) {
		containsNodeId(state.node, action.id, openedIds);

		return {
			node: state.node,
			openedIds,
			focusedId: action.id,
		};
	}

	if (action.kind === 'flip' && action.id !== null) {
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

	if (action.kind === 'open' && action.id !== null) {
		openedIds.add(action.id);

		return {
			node: state.node,
			openedIds,
			focusedId: action.id,
		};
	}

	if (action.kind === 'close' && action.id !== null) {
		if (openedIds.has(action.id)) {
			openedIds.delete(action.id);
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
		containsNodeId(node, focusedId, newOpenedIds);
	}

	return {
		node,
		openedIds: newOpenedIds,
		focusedId,
	};
};

type Props = {
	node: TreeNode;
	nodeIds: TreeNodeId[];
	nodesByDepth: ReadonlyArray<ReadonlyArray<TreeNode>>;
	fileNodes: FileTreeNode[] | null;
	caseHash: CaseHash;
	searchQuery: string;
	focusedNodeId: TreeNodeId | null;
	stagedJobs: JobHash[];
	openedIds: ReadonlySet<TreeNodeId>;
};

const TreeView = ({
	node,
	nodeIds,
	nodesByDepth,
	fileNodes,
	searchQuery,
	focusedNodeId,
	stagedJobs,
	openedIds,
}: Props) => {
	const allFileNodesReady = fileNodes !== null;
	const [state, dispatch] = useReducer(
		reducer,
		{
			node,
			focusedId: focusedNodeId,
			openedIds,
		},
		initializer,
	);
	const debouncedOnFileOrFolderSelectedRef = useRef(
		debounce((id: TreeNodeId) => {
			console.log('HELLO');
			vscode.postMessage({
				kind: fileNodeIds.has(id)
					? 'webview.fileExplorer.fileSelected'
					: 'webview.fileExplorer.folderSelected',
				id,
			});
		}, 300),
	);

	// @TODO  @UX Need to show info message to users.
	// I typed "App" search term, and saw empty results and i had no idea that i need to type more then 3 chars
	const userSearchingFile = searchQuery.length >= SEARCH_QUERY_MIN_LENGTH;

	const fileNodeIds = useMemo(
		() => new Set(fileNodes?.map((node) => node.id) ?? []),
		[fileNodes],
	);

	const onToggleJob = useCallback(
		(jobHash: JobHash) => {
			const stagedJobsSet = new Set(stagedJobs);

			if (stagedJobsSet.has(jobHash)) {
				stagedJobsSet.delete(jobHash);
			} else {
				stagedJobsSet.add(jobHash);
			}

			vscode.postMessage({
				kind: 'webview.global.stageJobs',
				jobHashes: Array.from(stagedJobsSet),
			});
		},
		[stagedJobs],
	);

	const renderItem = ({
		node,
		depth,
		index,
	}: {
		node: TreeNode | FileTreeNode;
		depth: number;
		index: number;
	}) => {
		const open = state.openedIds.has(node.id);
		const icon = getIcon(node.iconName ?? null, open);
		const focused = node.id === state.focusedId;
		const hasChildren = node.children && node.children.length > 0;
		const enableCheckbox = depth > 0 && !hasChildren;
		const Checkbox = () => {
			const checked = stagedJobs.includes((node as FileTreeNode).jobHash);

			return (
				<VSCodeCheckbox
					onClick={(event) => {
						event.stopPropagation();
						onToggleJob((node as FileTreeNode).jobHash);
					}}
					checked={checked}
				/>
			);
		};

		return (
			<TreeItem
				hasChildren={hasChildren}
				id={node.id}
				label={node.label ?? ''}
				subLabel=""
				icon={icon}
				depth={depth}
				kind={node.kind}
				open={open}
				focused={focused}
				onClick={() => {
					if (!allFileNodesReady) {
						return;
					}

					dispatch({ kind: 'focus', id: node.id });
				}}
				actionButtons={[
					enableCheckbox && allFileNodesReady && <Checkbox />,
				]}
				onPressChevron={() => {
					if (!allFileNodesReady) {
						return;
					}

					dispatch({ kind: 'flip', id: node.id });
				}}
				index={index}
				inlineStyles={{
					root: {
						...(enableCheckbox && {
							...(!focused && {
								backgroundColor:
									'var(--vscode-list-hoverBackground)',
							}),
							paddingRight: 4,
						}),
					},
					actions: { display: 'flex' },
				}}
			/>
		);
	};

	useEffect(() => {
		const handler = (e: MessageEvent<WebviewMessage>) => {
			const message = e.data;

			if (message.kind === 'webview.fileExplorer.focusNode') {
				dispatch({ kind: 'focus', id: message.id });
			}
		};

		window.addEventListener('message', handler);

		return () => {
			window.removeEventListener('message', handler);
		};
	}, []);

	useEffect(() => {
		if (searchQuery.length > 0) {
			dispatch({
				kind: 'blur',
				id: null,
			});
		}
	}, [searchQuery]);

	useEffect(() => {
		vscode.postMessage({
			kind: 'webview.fileExplorer.setState',
			openedIds: Array.from(state.openedIds),
			focusedId: state.focusedId,
		});
	}, [state]);

	useEffect(() => {
		const handler = () => {
			dispatch({
				kind: 'blur',
				id: null,
			});
		};

		window.addEventListener('blur', handler);

		return () => {
			window.removeEventListener('blur', handler);
		};
	}, []);

	useEffect(() => {
		if (state.focusedId === null) {
			return;
		}

		debouncedOnFileOrFolderSelectedRef.current(state.focusedId);
	}, [fileNodeIds, state.focusedId]);

	if (fileNodes === null || fileNodes.length === 0) {
		return null;
	}

	if (userSearchingFile) {
		const filteredFiles = fileNodes.filter(
			(node) =>
				node.kind === 'fileElement' &&
				node.id
					.toLowerCase()
					.includes(searchQuery.trim().toLocaleLowerCase()),
		);

		return (
			<ReactTreeView nodeLabel="">
				{filteredFiles?.map((node, index) => {
					const icon = getIcon(node.iconName ?? null, false);

					return (
						<TreeItem
							hasChildren={false}
							id={node.id}
							label={node.label ?? ''}
							subLabel={
								// take out the repo name
								node.id.split('/').slice(1).join('/')
							}
							icon={icon}
							depth={0}
							kind={node.kind}
							open={false}
							focused={node.id === state.focusedId}
							onClick={() => {
								dispatch({
									kind: 'focus',
									id: node.id,
								});
							}}
							actionButtons={[]}
							index={index}
						/>
					);
				})}
			</ReactTreeView>
		);
	}

	return (
		<Tree
			openedIds={state.openedIds}
			node={node}
			renderItem={renderItem}
			index={0}
			depth={0}
			focusedNodeId={state.focusedId}
			allFileNodesReady={allFileNodesReady}
			nodeIds={nodeIds}
			nodesByDepth={nodesByDepth}
			focus={(id: TreeNodeId) => {
				dispatch({
					kind: 'focus',
					id,
				});
			}}
			collapse={(id: TreeNodeId) => {
				dispatch({
					kind: 'close',
					id,
				});
			}}
			expand={(id: TreeNodeId) => {
				dispatch({
					kind: 'open',
					id,
				});
			}}
		/>
	);
};

export default TreeView;
