import ReactTreeView from 'react-treeview';
import { ReactNode, useEffect, useState } from 'react';
import Tree from '../../shared/Tree';
import {
	Command,
	TreeNode,
} from '../../../../src/components/webview/webviewEvents';
import { ReactComponent as BlueLightBulbIcon } from '../../assets/bluelightbulb.svg';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { ReactComponent as WrenchIcon } from '../../assets/wrench.svg';
import { vscode } from '../../shared/utilities/vscode';
import cn from 'classnames';
import { SEARCH_QUERY_MIN_LENGTH } from '../SearchBar';
import TreeItem from '../../shared/TreeItem';

type Props = {
	node: TreeNode;
	fileNodes: TreeNode[];
	searchQuery: string;
};

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
		case 'wrench.svg':
			icon = <WrenchIcon />;
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

const TreeView = ({ node, fileNodes, searchQuery }: Props) => {
	const userSearchingFile = searchQuery.length >= SEARCH_QUERY_MIN_LENGTH;
	const [focusedNodeId, setFocusedNodeId] = useState('');

	useEffect(() => {
		// Display diff view of all files on component mount
		if (node.command && (node.command.arguments ?? []).length > 0) {
			vscode.postMessage({
				kind: 'webview.command',
				value: node.command,
			});
		}
	}, [node.command]);

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
		index,
	}: {
		node: TreeNode;
		depth: number;
		open: boolean;
		setIsOpen: (value: boolean) => void;
		focusedNodeId: string;
		setFocusedNodeId: (value: string) => void;
		index: number;
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
				label={node.label ?? ''}
				subLabel=""
				icon={icon}
				depth={depth}
				kind={node.kind}
				open={open}
				focused={node.id === focusedNodeId}
				onClick={() => {
					setIsOpen(!open);
					setFocusedNodeId(node.id);
				}}
				actionButtons={actionButtons}
				index={index}
			/>
		);
	};

	if (userSearchingFile) {
		return (
			<ReactTreeView nodeLabel="">
				{fileNodes.map((node, index) => {
					if (node.kind !== 'fileElement') {
						return null;
					}
					const searchingFileFound =
						userSearchingFile &&
						node.kind === 'fileElement' &&
						(node.label ?? '').toLowerCase().includes(searchQuery);
					if (!searchingFileFound) {
						return null;
					}

					const icon = getIcon(node.iconName ?? null, false);

					return (
						<TreeItem
							disabled={false}
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
					setFocusedNodeId,
					focusedNodeId,
				})
			}
			index={0}
			depth={0}
		/>
	);
};

export default TreeView;
