import { useCallback } from 'react';
import TreeItem, { IconName } from './FileExplorerTreeNode';
import { ExplorerTree } from '../../../src/selectors/selectExplorerTree';
import { NodeDatum } from '../intuitaTreeView';
import {
	_ExplorerNode,
	_ExplorerNodeHashDigest,
} from '../../../src/persistedState/explorerNodeCodec';
import { vscode } from '../shared/utilities/vscode';

const getIconName = (
	explorerNode: _ExplorerNode,
	opened: boolean,
): IconName => {
	if (explorerNode.kind === 'ROOT') {
		return 'root';
	}

	if (explorerNode.kind === 'DIRECTORY') {
		return !opened ? 'folder' : 'folder-opened';
	}

	if (explorerNode.kind === 'FILE') {
		return explorerNode.fileAdded ? 'file-add' : 'file';
	}

	return 'file';
};

export const explorerNodeRenderer =
	(explorerTree: ExplorerTree) =>
	(props: {
		nodeDatum: NodeDatum<_ExplorerNodeHashDigest, _ExplorerNode>;
		onFlip: (hashDigest: _ExplorerNodeHashDigest) => void;
		onFocus: (hashDigest: _ExplorerNodeHashDigest) => void;
	}) => {
		const iconName = getIconName(
			props.nodeDatum.node,
			props.nodeDatum.expanded,
		);
		const focused = props.nodeDatum.focused;

		const { onFocus, onFlip, nodeDatum } = props;

		const explorerNodeHashDigest = props.nodeDatum.node.hashDigest;

		const checkboxState =
			explorerTree.hashDigestsOfExplorerNodesWithDeselectedChildNodes.includes(
				explorerNodeHashDigest,
			)
				? 'indeterminate'
				: explorerTree.selectedExplorerNodeHashDigests.includes(
						explorerNodeHashDigest,
				  )
				? 'checked'
				: 'blank';

		const handleClick = useCallback(
			(event: React.MouseEvent) => {
				event.stopPropagation();

				onFocus(nodeDatum.node.hashDigest);
			},
			[onFocus, nodeDatum.node.hashDigest],
		);

		const handleCheckboxClick = useCallback(
			(event: React.MouseEvent) => {
				event.stopPropagation();

				vscode.postMessage({
					kind: 'webview.global.flipSelectedExplorerNode',
					caseHashDigest: explorerTree.caseHash,
					explorerNodeHashDigest,
				});
			},
			[explorerNodeHashDigest],
		);

		const handleChevronClick = useCallback(
			(event: React.MouseEvent) => {
				event.stopPropagation();

				onFlip(nodeDatum.node.hashDigest);
			},
			[onFlip, nodeDatum.node.hashDigest],
		);

		return (
			<TreeItem
				key={props.nodeDatum.node.hashDigest}
				hasChildren={props.nodeDatum.collapsable}
				id={props.nodeDatum.node.hashDigest}
				label={props.nodeDatum.node.label}
				iconName={iconName}
				depth={props.nodeDatum.depth}
				open={props.nodeDatum.expanded}
				focused={focused}
				checkboxState={checkboxState}
				kind={props.nodeDatum.node.kind}
				onClick={handleClick}
				onCheckboxClick={handleCheckboxClick}
				onPressChevron={handleChevronClick}
			/>
		);
	};
