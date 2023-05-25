import ReactTreeView from 'react-treeview';
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
} from 'react';
import Tree from '../../shared/Tree';
import {
	FileTreeNode,
	JobHash,
	TreeNode,
} from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { vscode } from '../../shared/utilities/vscode';
import cn from 'classnames';
import { SEARCH_QUERY_MIN_LENGTH } from '../SearchBar';
import TreeItem from '../../shared/TreeItem';
import { useKey } from '../../jobDiffView/hooks/useKey';
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import { CaseHash } from '../../../../src/cases/types';

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

type Props = {
	node: TreeNode;
	nodeIds: string[];
	fileNodes: FileTreeNode[] | null;
	caseHash: CaseHash;
	searchQuery: string;
	focusedNodeId: string | null;
	setFocusedNodeId: Dispatch<SetStateAction<string | null>>;
	stagedJobs: JobHash[];
};

const TreeView = ({
	node,
	nodeIds,
	fileNodes,
	searchQuery,
	focusedNodeId,
	setFocusedNodeId,
	stagedJobs,
}: Props) => {
	const allFileNodesReady = fileNodes !== null;
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

	const handleArrowKeyDown = (key: 'ArrowUp' | 'ArrowDown') => {
		const currIndex = nodeIds.findIndex((val) => val === focusedNodeId);
		const newIndex = key === 'ArrowUp' ? currIndex - 1 : currIndex + 1;
		setFocusedNodeId((prev) => nodeIds[newIndex] ?? prev);
	};

	useKey('ArrowUp', () => {
		handleArrowKeyDown('ArrowUp');
		window.scrollBy(0, -20); // height of 1 tree item is slightly bigger than 20px
	});

	useKey('ArrowDown', () => {
		handleArrowKeyDown('ArrowDown');
		window.scrollBy(0, 20); // height of 1 tree item is slightly bigger than 20px
	});

	const renderItem = ({
		node,
		depth,
		open,
		setIsOpen,
		focusedNodeId,
		setFocusedNodeId,
		index,
	}: {
		node: TreeNode | FileTreeNode;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
		focusedNodeId: string | null;
		setFocusedNodeId: (value: string) => void;
		index: number;
	}) => {
		const icon = getIcon(node.iconName ?? null, open);
		const focused = node.id === focusedNodeId;
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
					setFocusedNodeId(node.id);
				}}
				actionButtons={[
					enableCheckbox && allFileNodesReady && <Checkbox />,
				]}
				onPressChevron={() => {
					if (!allFileNodesReady) {
						return;
					}
					setIsOpen(!open);
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
		const handler = () => {
			setFocusedNodeId(null);
		};

		window.addEventListener('blur', handler);

		return () => {
			window.removeEventListener('blur', handler);
		};
	}, [setFocusedNodeId]);

	useEffect(() => {
		if (focusedNodeId === null) {
			return;
		}

		if (fileNodeIds.has(focusedNodeId)) {
			vscode.postMessage({
				kind: 'webview.fileExplorer.fileSelected',
				id: focusedNodeId,
			});
		} else {
			vscode.postMessage({
				kind: 'webview.fileExplorer.folderSelected',
				id: focusedNodeId,
			});
		}
	}, [focusedNodeId, fileNodeIds]);

	if (userSearchingFile) {
		return (
			<ReactTreeView nodeLabel="">
				{fileNodes?.map((node, index) => {
					if (node.kind !== 'fileElement') {
						return null;
					}
					// e.g., cal.com/packages/file.tsx
					const relativeFilePath = node.id ?? '';
					const searchingFileFound =
						userSearchingFile &&
						node.kind === 'fileElement' &&
						relativeFilePath.toLowerCase().includes(searchQuery);
					if (!searchingFileFound) {
						return null;
					}

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
							focused={node.id === focusedNodeId}
							onClick={() => {
								setFocusedNodeId(node.id);
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
			node={node}
			renderItem={(props) =>
				renderItem({
					...props,
					focusedNodeId,
					setFocusedNodeId,
				})
			}
			index={0}
			depth={0}
			focusedNodeId={focusedNodeId}
			allFileNodesReady={allFileNodesReady}
		/>
	);
};

export default TreeView;
