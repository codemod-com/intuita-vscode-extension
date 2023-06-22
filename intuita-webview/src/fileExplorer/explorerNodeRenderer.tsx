import { ReactComponent as CaseIcon } from '../assets/case.svg';
import cn from 'classnames';
import { ReactNode } from 'react';
import TreeItem from '../shared/TreeItem';
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import {
	ExplorerNode,
	ExplorerNodeHashDigest,
	ExplorerTree,
	buildDirectoryNode,
} from '../../../src/selectors/selectExplorerTree';
import { NodeDatum } from '../intuitaTreeView';

const getIcon = (explorerNode: ExplorerNode, opened: boolean): ReactNode => {
	if (explorerNode.kind === 'TOP') {
		return <CaseIcon />;
	}

	if (explorerNode.kind === 'DIRECTORY') {
		return (
			<span
				className={cn(
					'codicon',
					!opened ? 'codicon-folder' : 'codicon-folder-opened',
				)}
			/>
		);
	}

	if (explorerNode.kind === 'FILE') {
		return (
			<span
				className={cn('codicon', {
					'codicon-file-add': explorerNode.fileAdded,
					'codicon-file': !explorerNode.fileAdded,
				})}
			/>
		);
	}

	return null;
};

export const explorerNodeRenderer =
	(
		explorerTree: ExplorerTree,
		onToggleJob: (hashDigest: ExplorerNodeHashDigest) => void,
	) =>
	(props: {
		nodeDatum: NodeDatum<ExplorerNodeHashDigest, ExplorerNode>;
		onFlip: (hashDigest: ExplorerNodeHashDigest) => void;
		onFocus: (hashDigest: ExplorerNodeHashDigest) => void;
	}) => {
		const icon = getIcon(props.nodeDatum.node, props.nodeDatum.expanded);
		const focused = props.nodeDatum.focused;
		const hasChildren = props.nodeDatum.childCount > 0;

		const Checkbox = () => {
			const nodeKind = props.nodeDatum.node.kind;
			if (nodeKind !== 'FILE' && nodeKind !== 'DIRECTORY') {
				return null;
			}

			let checked =
				!explorerTree.deselectedChangeExplorerNodeHashDigests.includes(
					props.nodeDatum.node.hashDigest,
				);

			const deselectedDirectoryNodes = new Set(
				explorerTree.nodeData
					.filter(
						(nodeDatum) =>
							nodeDatum.node.kind === 'DIRECTORY' &&
							explorerTree.deselectedChangeExplorerNodeHashDigests.includes(
								nodeDatum.node.hashDigest,
							),
					)
					.map(
						(nodeDatum) =>
							nodeDatum.node as ReturnType<
								typeof buildDirectoryNode
							>,
					),
			);

			for (const deselectedDirectoryNode of deselectedDirectoryNodes) {
				if (
					props.nodeDatum.node.path.startsWith(
						deselectedDirectoryNode.path,
					)
				) {
					checked = false;
					break;
				}
			}

			return (
				<VSCodeCheckbox
					onClick={(event) => {
						event.stopPropagation();
						onToggleJob(props.nodeDatum.node.hashDigest);
					}}
					checked={checked}
				/>
			);
		};

		return (
			<TreeItem
				hasChildren={hasChildren}
				id={props.nodeDatum.node.hashDigest}
				label={props.nodeDatum.node.label}
				subLabel=""
				icon={icon}
				depth={props.nodeDatum.depth}
				open={props.nodeDatum.expanded}
				focused={focused}
				onClick={(event) => {
					event.stopPropagation();

					props.onFocus(props.nodeDatum.node.hashDigest);
				}}
				actionButtons={[<Checkbox />]}
				onPressChevron={(event) => {
					event.stopPropagation();

					props.onFlip(props.nodeDatum.node.hashDigest);
				}}
				inlineStyles={{
					root: {
						...(props.nodeDatum.node.kind === 'FILE' &&
							!focused && {
								backgroundColor:
									'var(--vscode-list-hoverBackground)',
							}),
						paddingRight: 4,
					},
					actions: { display: 'flex' },
				}}
			/>
		);
	};
